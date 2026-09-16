#!/usr/bin/env python3
"""
份量校準：用愛料理（icook.tw）熱門食譜的每人份食材量，對照 recipes.js。

用法：
  python3 tools/calibrate.py --ids egg-tomato,egg-scallion   # 指定幾道
  python3 tools/calibrate.py --all                           # 全部
  python3 tools/calibrate.py --ids ... --top 5 --sleep 1.5

只拿數字（份量、食材數量），不拿文字；輸出：
  tools/calibration/raw/<id>.json     每道抓到的原始資料
  tools/calibration/report.md         對照表（我們 vs 愛料理中位數）
  tools/calibration/proposals.json    建議修改（差 ≥30% 的），人看過才套用
"""
import argparse, json, re, html, statistics, sys, time, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "tools/calibration/raw"
RAW.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) recipe-tool-calibration/1.0"}
THRESHOLD = 0.30  # 每人份差 30% 以上才建議改

# ── 讀 recipes.js（純 JS 檔，用 node 轉 JSON）──
def load_recipes():
    import subprocess
    js = ('const fs=require("fs");const m={};'
          'new Function("module",fs.readFileSync("ingredients.js","utf8")+fs.readFileSync("recipes.js","utf8")+'
          '"\\nmodule.exports={RECIPES,INGREDIENT_CATALOG};")(m);'
          'console.log(JSON.stringify(m.exports));')
    out = subprocess.check_output(["node", "-e", js], cwd=ROOT)
    return json.loads(out)

# ── 抓網頁 ──
def fetch(url, sleep):
    time.sleep(sleep)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def strip(t):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))).strip()

def search(name, sleep):
    url = "https://icook.tw/search/" + urllib.parse.quote(name) + "/"
    s = fetch(url, sleep)
    cards = re.findall(r'<a[^>]+href="/recipes/(\d+)"[^>]*>(.*?)</a>', s, re.S)
    seen, out = set(), []
    for rid, body in cards:
        if rid in seen:
            continue
        seen.add(rid)
        t = strip(body)
        if not t or "官方品牌廚房" in t:
            continue
        title = t.split(" ")[0]
        likes = re.search(r"(\d+)\s*讚", t)
        out.append({"id": rid, "title": title, "likes": int(likes.group(1)) if likes else 0, "text": t[:120]})
    return out

def parse_recipe(rid, sleep):
    s = fetch(f"https://icook.tw/recipes/{rid}", sleep)
    m = re.search(r"份量\s*</[^>]+>\s*<[^>]+>\s*([\d.]+)\s*人份", strip_keep_tags(s)) or re.search(r"份量[^0-9]{0,40}([\d.]+)\s*人份", strip(s[s.find("servings-info"):s.find("servings-info") + 800]) if "servings-info" in s else "")
    servings = float(m.group(1)) if m else None
    items = []
    for li in re.findall(r'<li class="ingredient[^"]*">(.*?)</li>', s, re.S):
        t = strip(li)
        parts = t.rsplit(" ", 1)
        if len(parts) == 2:
            items.append({"name": parts[0], "amount": parts[1]})
        else:
            items.append({"name": t, "amount": ""})
    title = strip(re.search(r"<title>(.*?)</title>", s, re.S).group(1)) if "<title>" in s else ""
    return {"id": rid, "title": title, "servings": servings, "items": items}

def strip_keep_tags(s):
    return s

# ── 數量解析：'2顆' '4-5顆' '300g' '半顆' '1/2條' '1又1/2' ──
CN_NUM = {"半": 0.5, "一": 1, "兩": 2, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10}
UNIT_ALIAS = {"g": "克", "公克": "克", "個": "顆", "粒": "顆", "隻": "支", "只": "支", "片": "片", "塊": "塊", "條": "條", "根": "根",
              "朵": "朵", "把": "把", "碗": "碗", "盒": "盒", "包": "包", "支": "支", "顆": "顆", "克": "克", "杯": "杯",
              "大匙": "大匙", "小匙": "小匙", "湯匙": "大匙", "茶匙": "小匙", "匙": "大匙", "斤": "斤", "台斤": "斤", "兩": "兩",
              "尾": "尾", "ml": "毫升", "cc": "毫升", "毫升": "毫升"}

def parse_amount(a):
    a = a.replace("～", "-").replace("~", "-").replace("－", "-").strip()
    if not a or any(k in a for k in ["適量", "少許", "少量", "隨意", "酌量"]):
        return None, None
    m = re.match(r"^(約)?\s*([\d.]+(?:/\d+)?)(?:-([\d.]+))?(?:又([\d]+/[\d]+))?\s*([^\d\s]+)?$", a)
    if m:
        lo = eval_frac(m.group(2))
        hi = eval_frac(m.group(3)) if m.group(3) else lo
        n = (lo + hi) / 2
        if m.group(4):
            n += eval_frac(m.group(4))
        unit = m.group(5) or ""
    else:
        m2 = re.match(r"^([半一兩二三四五六七八九十]+)\s*([^\d\s]+)?$", a)
        if not m2:
            return None, None
        n = CN_NUM.get(m2.group(1), None)
        if n is None:
            return None, None
        unit = m2.group(2) or ""
    unit = unit.strip()
    for k, v in UNIT_ALIAS.items():
        if unit.startswith(k):
            unit = v
            break
    if unit == "斤":
        n, unit = n * 600, "克"
    if unit == "兩":
        n, unit = n * 37.5, "克"
    return n, unit

def eval_frac(s):
    if "/" in s:
        a, b = s.split("/")
        return float(a) / float(b)
    return float(s)

# ── 食材名對應：愛料理名稱 → 我們的正規名稱 ──
def build_matcher(catalog):
    table = {}
    for it in catalog:
        table[it["name"]] = it["name"]
        for a in it["aliases"]:
            table[a] = it["name"]
    keys = sorted(table, key=len, reverse=True)

    def match(raw):
        r = re.sub(r"[（(].*?[)）]", "", raw).strip()
        r = r.replace("蕃茄", "番茄").replace("土雞蛋", "雞蛋")
        if r in table:
            return table[r]
        for k in keys:
            if len(k) >= 2 and k in r:
                return table[k]
        if "蛋" == r or r.endswith("蛋") and "皮蛋" not in r and "鹹蛋" not in r and "滷蛋" not in r:
            return "雞蛋"
        return None
    return match

# 愛料理常見單位 → 我們的單位（近似值，只用來校準數量級）
CONVERT = {
    ("豆干", "塊"): ("片", 1), ("嫩豆腐", "塊"): ("盒", 1), ("板豆腐", "盒"): ("塊", 1), ("雞蛋豆腐", "塊"): ("盒", 1),
    ("高麗菜", "顆"): ("克", 1000), ("大白菜", "顆"): ("克", 1200), ("蛤蜊", "顆"): ("克", 10),
    ("麵條", "把"): ("克", 100), ("麵條", "球"): ("克", 100), ("烏龍麵", "球"): ("包", 1),
    ("雞腿肉", "片"): ("克", 250), ("雞腿肉", "支"): ("克", 250), ("雞腿肉", "隻"): ("克", 250),
    ("雞胸肉", "片"): ("克", 250), ("雞胸肉", "塊"): ("克", 250),
    ("豬里肌", "片"): ("片", 1), ("排骨", "斤"): ("克", 600), ("豬絞肉", "盒"): ("克", 300), ("牛絞肉", "盒"): ("克", 300),
    ("年糕", "包"): ("克", 500), ("金針菇", "把"): ("包", 1), ("鴻喜菇", "把"): ("包", 1),
    ("番茄", "個"): ("顆", 1), ("蔥", "支"): ("根", 1), ("蔥", "枝"): ("根", 1),
    ("九層塔", "包"): ("把", 1), ("蝦仁", "尾"): ("克", 10), ("蝦仁", "隻"): ("克", 10),
    ("鮭魚", "塊"): ("片", 1), ("鯖魚", "尾"): ("片", 2), ("鱈魚", "塊"): ("片", 1), ("魚片", "塊"): ("片", 1),
    ("馬鈴薯", "個"): ("顆", 1), ("洋蔥", "個"): ("顆", 1), ("青椒", "個"): ("顆", 1), ("甜椒", "個"): ("顆", 1),
    ("白飯", "杯"): ("碗", 1), ("白米", "米杯"): ("杯", 1),
}

def convert(name, n, unit, target):
    if unit == target:
        return n
    key = (name, unit)
    if key in CONVERT and CONVERT[key][0] == target:
        return n * CONVERT[key][1]
    if unit == "" and target != "克":
        return n
    return None

def per_serving(n, servings):
    return n / servings if servings else None

# 調味料名稱正規化（只留常見幾種，其餘丟掉）
SEASON = [("醬油", ["醬油", "蔭油", "生抽"]), ("醬油膏", ["醬油膏", "蠔油"]), ("糖", ["糖"]), ("米酒", ["米酒", "清酒", "日本酒"]),
          ("味醂", ["味醂"]), ("味噌", ["味噌"]), ("豆瓣醬", ["豆瓣", "豆辨"]), ("韓式辣醬", ["辣椒醬", "辣醬", "苦椒醬"]),
          ("甜麵醬", ["甜麵醬"]), ("鹽", ["鹽"]), ("油", ["油"]), ("水", ["水"]), ("太白粉", ["太白粉"]), ("白醋", ["白醋", "醋"])]
SEASON_ORDER = [k for k, _ in SEASON]

def season_key(raw):
    r = re.sub(r"[（(].*?[)）]", "", raw)
    for key, subs in SEASON:
        if key == "油" and any(x in r for x in ["醬油", "香油", "麻油"]):
            continue
        if key == "水" and any(x in r for x in ["水果", "太白粉水"]):
            continue
        if any(x in r for x in subs):
            return key
    return None

# 我們的菜名在愛料理搜不到（404）時改用的查詢詞
QUERY_ALIAS = {
    "煎豆腐佐醬油蔥花": "煎豆腐", "味噌烤雞胸": "味噌雞胸", "健康版糖醋里肌": "糖醋里肌", "蒜蓉炒蝦仁": "蒜香蝦仁",
    "涼拌芥末花椰菜": "涼拌花椰菜", "涼拌皮蛋茄子": "皮蛋茄子", "蒜味小黃瓜炒蛋": "小黃瓜炒蛋", "開陽空心菜": "蝦米空心菜",
    "小魚乾炒地瓜葉": "地瓜葉小魚乾", "開陽地瓜葉": "蝦米地瓜葉", "電鍋香菇滷雞腿": "香菇滷雞腿", "蜂蜜醬油烤雞翅": "蜂蜜烤雞翅",
    "三色豆滑蛋燴飯": "滑蛋燴飯", "番茄燴鱈魚": "番茄鱈魚", "芹菜芥藍炒透抽": "芹菜炒透抽", "香腸炒三色豆": "三色豆炒香腸",
    "韭菜豆芽炒麵": "豆芽炒麵", "年糕海帶蛋湯": "年糕湯", "豆皮韭黃炒蛋": "韭黃炒蛋", "絲瓜燴透抽": "絲瓜透抽",
    "小魚乾炒苦瓜": "苦瓜小魚乾", "小魚乾炒青椒": "小魚乾青椒", "毛豆蝦仁炒玉米筍": "毛豆炒蝦仁", "氣炸鹽烤鯖魚": "氣炸鯖魚",
    "香煎鱈魚佐櫛瓜": "香煎鱈魚",
}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--top", type=int, default=5)
    ap.add_argument("--sleep", type=float, default=1.5)
    args = ap.parse_args()

    data = load_recipes()
    recipes = data["RECIPES"]
    match = build_matcher(data["INGREDIENT_CATALOG"])
    whole = {i["name"] for i in data["INGREDIENT_CATALOG"] if i.get("whole")}
    if args.ids:
        want = set(args.ids.split(","))
        recipes = [r for r in recipes if r["id"] in want]
    elif not args.all:
        print("給 --ids 或 --all"); sys.exit(1)

    report = ["# 份量校準對照表（愛料理熱門食譜中位數 vs 我們）", "",
              f"每人份差 ≥{int(THRESHOLD*100)}% 標 ⚠️；『適量／少許』不計；n＝有具體數字的篇數", ""]
    proposals = []
    for r in recipes:
        raw_path = RAW / f"{r['id']}.json"
        if raw_path.exists():
            raw = json.loads(raw_path.read_text())
        else:
            try:
                hits = search(QUERY_ALIAS.get(r["name"], r["name"]), args.sleep)
            except Exception as e:
                print(f"[{r['id']}] 搜尋失敗：{e}"); continue
            # 同名優先（標題含菜名），再依讚數
            exact = [h for h in hits if r["name"] in h["title"] or h["title"] in r["name"]]
            pool = (exact or hits)
            pool.sort(key=lambda h: -h["likes"])
            picked = []
            for h in pool[: args.top * 2]:
                if len(picked) >= args.top:
                    break
                try:
                    p = parse_recipe(h["id"], args.sleep)
                except Exception as e:
                    print(f"[{r['id']}] 抓 {h['id']} 失敗：{e}"); continue
                if p["servings"] and p["items"]:
                    p["likes"] = h["likes"]
                    picked.append(p)
            raw = {"recipe": r["name"], "hits": hits[:15], "picked": picked}
            raw_path.write_text(json.dumps(raw, ensure_ascii=False, indent=1))
            print(f"[{r['id']}] {r['name']}：搜到 {len(hits)}，用了 {len(picked)} 篇")

        picked = raw["picked"]
        report.append(f"## {r['name']}（我們 {r['baseServings']} 人份；愛料理 {len(picked)} 篇：" +
                      "、".join(f"{p['servings']:g}人份/{p.get('likes',0)}讚" for p in picked) + "）")
        report.append("")
        report.append("| 食材 | 我們／人 | 愛料理中位數／人（n） | 各篇 | 判定 |")
        report.append("|---|---|---|---|---|")
        for ing in r["ingredients"]:
            ours = ing["amount"] / r["baseServings"]
            vals, shown = [], []
            for p in picked:
                for it in p["items"]:
                    if match(it["name"]) != ing["name"]:
                        continue
                    n, unit = parse_amount(it["amount"])
                    if n is None:
                        shown.append(f"{it['amount']}")
                        continue
                    conv = convert(ing["name"], n, unit, ing["unit"])
                    if conv is None:
                        shown.append(f"{n:g}{unit}≠")
                        continue
                    ps = per_serving(conv, p["servings"])
                    vals.append(ps)
                    shown.append(f"{ps:.2g}")
                    break
            if vals:
                med = statistics.median(vals)
                diff = (med - ours) / ours if ours else 0
                flag = "⚠️" if abs(diff) >= THRESHOLD and len(vals) >= 2 else ("？" if abs(diff) >= THRESHOLD else "OK")
                report.append(f"| {ing['name']} | {ours:.2g} {ing['unit']} | {med:.2g}（{len(vals)}） | {'、'.join(shown)} | {flag} {diff:+.0%} |")
                if flag == "⚠️":
                    new_total = med * r["baseServings"]
                    if ing["name"] in whole or ing["unit"] != "克":
                        new_total = round(new_total * 2) / 2 if ing["name"] not in whole else max(1, round(new_total))
                    else:
                        new_total = round(new_total / 10) * 10 if new_total >= 50 else round(new_total / 5) * 5
                    proposals.append({"id": r["id"], "name": r["name"], "ingredient": ing["name"], "unit": ing["unit"],
                                      "from": ing["amount"], "to": new_total, "median_per_serving": round(med, 2), "n": len(vals)})
            else:
                report.append(f"| {ing['name']} | {ours:.2g} {ing['unit']} | —（0） | {'、'.join(shown) or '未列'} | 無資料 |")
        # 調味料：正規化名稱，取每人份中位數（單位以大匙為主；小匙÷3、克÷15 近似）
        seas = {}
        for p in picked:
            for it in p["items"]:
                if match(it["name"]):
                    continue
                key = season_key(it["name"])
                if not key:
                    continue
                n, unit = parse_amount(it["amount"])
                if n is None:
                    continue
                if unit == "小匙":
                    n = n / 3
                elif unit in ("克", "毫升") and key not in ("水",):
                    n = n / 15
                elif unit in ("克", "毫升") and key == "水":
                    n = n / 15
                elif unit not in ("大匙", ""):
                    continue
                seas.setdefault(key, []).append(n / p["servings"])
        if seas:
            parts = []
            for k in SEASON_ORDER:
                if k in seas:
                    parts.append(f"{k} {statistics.median(seas[k]):.2g} 大匙/人（n={len(seas[k])}）")
            report.append("")
            report.append("調味料中位數：" + "；".join(parts))
        report.append("")

    (ROOT / "tools/calibration/report.md").write_text("\n".join(report))
    (ROOT / "tools/calibration/proposals.json").write_text(json.dumps(proposals, ensure_ascii=False, indent=1))
    print(f"\n對照表：tools/calibration/report.md；建議修改 {len(proposals)} 項：tools/calibration/proposals.json")

if __name__ == "__main__":
    main()
