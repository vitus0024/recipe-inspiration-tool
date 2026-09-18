# 調味料產生器：從 steps 文字抓出調味料＋明寫的用量；沒寫量的套家常預設（以 2 人份為基準，依 baseServings 等比）
import json, os, re, subprocess, sys
# 用法：python3 tools/gen-seasonings.py out.json > 預覽.txt（產生器只輸出 JSON，寫回 recipes.js 那步在 2026-09-17 已做過一次，之後改單道請直接改 recipes.js）
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OVR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seasoning-overrides.json")
recipes = json.loads(subprocess.check_output(["node", "-e", '''
const fs=require("fs");const src=fs.readFileSync(process.argv[1]+"/recipes.js","utf8");
const m={};new Function("m",src+";m.R=RECIPES;")(m);console.log(JSON.stringify(m.R));''', ROOT]))

NUM = r"(\d+(?:\.\d+)?|半|一|兩|三|四|五|六|八|十)"
def num(s):
    return {"半":0.5,"一":1,"兩":2,"三":3,"四":4,"五":5,"六":6,"八":8,"十":10}.get(s) or float(s)

# (名稱, 偵測用正規式, 排除詞)
KEYS = [
 ("醬油", r"醬油", ["醬油膏"]), ("米酒", r"米酒", []), ("味醂", r"味醂", []), ("味噌", r"味噌", []),
 ("糖", r"糖", ["糖醋","糖粉","糖醋醬"]), ("鹽", r"鹽", ["鹽水","鹽漬","薄鹽","胡椒鹽","鹽酥","鹽烤","鹽量"]),
 ("香油", r"香油", []), ("白醋", r"白醋", []), ("烏醋", r"烏醋", []), ("太白粉", r"太白粉", []),
 ("蠔油", r"蠔油", []), ("豆瓣醬", r"豆瓣醬", []), ("黑胡椒", r"黑胡椒", []), ("白胡椒", r"白胡椒", []),
 ("胡椒鹽", r"胡椒鹽", []), ("咖哩塊", r"咖哩塊", []), ("番茄醬", r"番茄醬", []), ("魚露", r"魚露", []),
 ("韓式辣醬", r"韓式辣醬", []), ("甜麵醬", r"甜麵醬", []), ("芝麻醬", r"芝麻醬", []), ("蜂蜜", r"蜂蜜", []),
 ("五香粉", r"五香粉", []), ("花椒粉", r"花椒粉", []), ("八角", r"八角", []), ("豆腐乳", r"豆腐乳", []),
 ("破布子", r"破布子", []), ("柴魚片", r"柴魚片", []), ("白芝麻", r"白芝麻", []), ("芥末", r"芥末", []),
 ("七味粉", r"七味粉", []), ("地瓜粉", r"地瓜粉", []), ("麵粉", r"麵粉", ["麵包粉"]), ("麵包粉", r"麵包粉", []),
 ("奶油", r"奶油", []), ("牛奶", r"牛奶", []), ("豆豉", r"豆豉", []), ("紅蔥頭", r"紅蔥頭", []),
 ("起司", r"起司", []), ("豬排醬", r"豬排醬", []), ("蘿蔔泥", r"蘿蔔泥", []), ("糖粉", r"糖粉", []),
 ("蒜", r"蒜", ["蒜香","蒜味","蒜炒","蒜烤","蒜蓉炒"]), ("薑", r"薑", ["薑燒"]), ("蔥", r"蔥", ["紅蔥頭","蔥爆","蔥花蛋","洋蔥"]),
 ("辣椒", r"辣椒", ["辣椒醬","韓式辣醬"]), ("乾辣椒", r"乾辣椒", []),
 ("食用油", r"(熱油鍋|熱鍋.{0,3}油|少油|下油|少許油|油鍋|用油、|過油|油燒到|油 170|大匙油|小匙油|放油|爆香|炒軟|炒散|炒至|煎至|乾煎)", ["香油爆香","冷鍋","香油"]),
 ("水", r"水", ["鹽水","水分","出水","泡水",r"(?<!許)水煮","冷水","滾水","熱水","溫水","煮麵水","香菇水","冰鎮","水果","淋水","噴.{0,3}水","苦水","去血水","沖水","水分","開水","水中","水量","泡鹽水","水槍","水喔","吐沙"]),
 ("檸檬汁", r"檸檬汁", []),
]
# 預設用量（2 人份）：(amount, unit)；None 表示「少許」
DEF = {
 "醬油":(1,"大匙"), "米酒":(1,"大匙"), "味醂":(1,"大匙"), "味噌":(1.5,"大匙"), "糖":(0.5,"小匙"), "鹽":(0.25,"小匙"),
 "香油":(1,"小匙"), "白醋":(1,"大匙"), "烏醋":(1,"小匙"), "太白粉":(1,"小匙"), "蠔油":(1,"大匙"), "豆瓣醬":(1,"大匙"),
 "黑胡椒":(None,"少許"), "白胡椒":(None,"少許"), "胡椒鹽":(None,"適量"), "咖哩塊":(2,"塊"), "番茄醬":(2,"大匙"),
 "魚露":(1,"大匙"), "韓式辣醬":(1,"大匙"), "甜麵醬":(2,"大匙"), "芝麻醬":(2,"大匙"), "蜂蜜":(1,"大匙"),
 "五香粉":(None,"少許"), "花椒粉":(None,"少許"), "八角":(1,"顆"), "豆腐乳":(1,"塊"), "破布子":(1,"大匙"),
 "柴魚片":(None,"適量"), "白芝麻":(None,"少許"), "芥末":(1,"小匙"), "七味粉":(None,"少許"), "地瓜粉":(None,"適量"),
 "麵粉":(None,"適量"), "麵包粉":(None,"適量"), "奶油":(1,"小塊"), "牛奶":(3,"大匙"), "豆豉":(1,"小匙"), "紅蔥頭":(2,"顆"),
 "起司":(None,"適量"), "豬排醬":(None,"適量"), "蘿蔔泥":(None,"適量"), "糖粉":(None,"少許"),
 "蒜":(2,"瓣"), "薑":(3,"片"), "蔥":(1,"根"), "辣椒":(1,"根"), "乾辣椒":(3,"根"), "食用油":(1,"大匙"), "水":(None,"適量"), "檸檬汁":(None,"少許"),
}
NOSCALE_DEFAULT = {"食用油"}  # 油不隨 baseServings 放大太多

def detect(text, key, pat, excl):
    t = text
    for e in excl:
        t = re.sub(e, lambda m: "＿"*len(m.group(0)), t)
    return re.search(pat, t) is not None

def explicit(text, key):
    # 「醬油 2 大匙」「糖 1 小匙」「水 3 杯」「八角 1 顆」「咖哩塊」
    if key == "食用油":
        m = re.search(NUM + r"\s*(大匙|小匙)油", text)
        return (num(m.group(1)), m.group(2)) if m else None
    m = re.search(re.escape(key) + r"(?:末|頭|泥|片|絲|粉)?\s*" + NUM + r"(?:\.\d+)?\s*(大匙|小匙|杯|顆|塊|根|片|瓣)", text)
    if m:
        return num(m.group(1)), m.group(2)
    return None

out = {}
for r in recipes:
    steps = " / ".join(r["steps"])
    ing_names = {i["name"] for i in r["ingredients"]}
    ratio = r["baseServings"] / 2
    items = []
    seen = set()
    for key, pat, excl in KEYS:
        if key in ing_names: continue
        if key == "薑" and "薑燒" in r["name"] and "薑泥" in steps: pass
        if not detect(steps, key, pat, excl):
            if key == "水" and r["method"] in ("湯", "煮") and "水煮滾" in steps and "義大利麵" not in r["name"]:
                items.append({"name": "水", "amount": round(3 * ratio * 2) / 2, "unit": "杯"}); seen.add("水")
            continue
        if key == "辣椒" and "乾辣椒" in steps: continue
        if key == "蔥" and "蔥" in ing_names: continue
        if key in seen: continue
        seen.add(key)
        ex = explicit(steps, key)
        if key == "水" and not ex:
            m = re.search(r"水(?:或高湯)?\s*" + NUM + r"\s*杯", steps)
            if m: ex = (num(m.group(1)), "杯")
            elif "少許水" in steps or "水 2 大匙" in steps or "水 3 大匙" in steps: ex = (2, "大匙")
            elif "蓋過" in steps: ex = (None, "適量")
            elif r["method"] in ("燒", "燴"): ex = (0.5, "杯")
        if key == "薑" and not ex:
            ex = (3, "片") if "薑片" in steps else (1, "小塊")
        if key == "蔥" and not ex:
            ex = (2, "根") if "蔥段" in steps else (1, "根")
        if key == "咖哩塊" and not ex:
            ex = (round(2 * ratio), "塊")
        if key == "食用油" and r["method"] == "涼拌": continue
        if key == "檸檬汁" and "檸檬" in ing_names: continue
        if key == "食用油" and r["method"] == "炸": ex = (None, "適量")
        if key == "太白粉" and not ex and ("拍" in steps or "沾裹太白粉" in steps): ex = (None, "適量")
        if not ex and re.search("少許" + key, steps) and DEF[key][1] == "大匙": ex = (1, "小匙")
        if key == "水" and r["method"] in ("湯", "煮") and ex == (None, "適量") and "水煮滾" in steps: ex = (round(3 * ratio * 2) / 2, "杯")
        if key == "鹽" and not ex and r["method"] in ("湯", "煮") and "水" in steps: ex = (round(0.75 * ratio * 4) / 4, "小匙")
        if key == "糖" and not ex and r["method"] == "涼拌": ex = (round(1.5 * ratio * 2) / 2, "小匙")
        if key == "鹽" and not ex and r["method"] in ("炒", "煎", "烤"): ex = (round(0.5 * ratio * 4) / 4, "小匙")  # 少鹽（2026-09-18）
        if key == "鹽" and not ex and r["method"] == "燉": ex = (0.75 if r["baseServings"] >= 3 else 0.5, "小匙")  # 一鍋 3～4 人份收尾調味，不再等比放大
        if key == "味噌" and not ex and r["method"] == "烤": ex = (round(1 * ratio * 2) / 2, "大匙")
        if key == "醬油" and not ex:
            mention = [s for s in r["steps"] if "醬油" in s]
            if mention and all("醃" in s for s in mention): ex = (round(2 * ratio * 2) / 2, "小匙")
        if ex:
            amt, unit = ex
        else:
            amt, unit = DEF[key]
            if amt is not None and key not in NOSCALE_DEFAULT and unit in ("大匙","小匙"):
                amt = round(amt * ratio * 4) / 4
                if amt < 0.25: amt = 0.25
            elif amt is not None and key in ("蒜","薑","蔥","辣椒") and ratio > 1:
                amt = round(amt * ratio)
        items.append({"name": key, "amount": amt, "unit": unit})
    out[r["id"]] = items


S = lambda n,a,u: {"name": n, "amount": a, "unit": u}
OVERRIDES = json.load(open(OVR)) if os.path.exists(OVR) else {}
for rid, lst in OVERRIDES.items():
    assert rid in out, rid
    out[rid] = [S(*x) for x in lst]
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=0)
for r in recipes:
    print(r["id"], "|", r["name"], r["baseServings"], "人 |", "，".join((i["name"] + (("" if i["amount"] is None else " " + ("半" if i["amount"]==0.5 else str(i["amount"]).rstrip("0").rstrip("."))) + " " + i["unit"]).strip()) for i in out[r["id"]]))
