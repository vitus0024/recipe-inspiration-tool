# 週末備料產生器：把每道 steps 切成「週末可先做」與「平日組合」，並估兩段時間
import json, os, re, subprocess, sys
# 用法：python3 tools/gen-prep.py out.json > 預覽.txt（只輸出 JSON；2026-09-18 已寫回一次，之後改單道請直接改 recipes.js）
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recipes = json.loads(subprocess.check_output(["node", "-e", '''
const fs=require("fs");const src=fs.readFileSync(process.argv[1]+"/recipes.js","utf8");
const m={};new Function("m",src+";m.R=RECIPES;")(m);console.log(JSON.stringify(m.R));''', ROOT]))

COOK = re.compile(r"熱鍋|熱油鍋|冷鍋|下鍋|爆香|炒|煎|煮滾|水煮滾|滾水|蒸|烤箱|氣炸|按下|燜|滷|燉|淋|煮|烤|炸|拌入|拌勻|沖冷水|燙")
PREP_ONLY = re.compile(r"切|洗|醃|泡|去腸泥|擦乾|剝|摘|拍|剪|對切|去籽|抓|吐沙|剝殼|去蒂|去皮|撕|刨|打散|調成|調開|混合|退冰|拌至有黏性|填入|過篩|抹")
SEAFOOD = re.compile(r"蝦|魚|蛤蜊|透抽|鮭|鯖|鱈")
MEAT = re.compile(r"雞|豬|牛|肉|排骨|培根|香腸|絞肉|里肌|五花|雞翅")
LEAFY = re.compile(r"空心菜|地瓜葉|菠菜|A菜|韭菜|韭黃|青江菜|豆芽|九層塔|芹菜|芥藍|大白菜|高麗菜")
SAUCE = re.compile(r"醬汁|調成|調開|以 1:1:1|拌勻備用|調味料混合")
EGG = re.compile(r"雞蛋|蛋")
STAPLE = re.compile(r"白飯|白米|冬粉|麵|義大利麵|烏龍麵|年糕|吐司")

def classify(step, r):
    """回傳 (type, what, keep) 或 None（這步不適合週末先做）"""
    s = step.replace("雞蛋", "蛋").replace("蝦米", "開陽").replace("小魚乾", "小魚").replace("柴魚", "柴")
    if re.search(r"^(熱鍋|熱油鍋|冷鍋|大火|中火|小火|同鍋|鍋中|原鍋|熱少許油|淋入|倒入|放回|加回|開蓋|翻面|取出|盛)", s): return None
    if re.search(r"拌勻即可|拌入|淋上|即可$|鋪盤|排盤|鋪在|鋪於|浸泡", s) and not re.search(r"(?<!醃)醃(?!醬|料)", s): return None
    if re.search(r"白米洗淨|白飯", s) and not re.search(r"切|醃", s): return None
    if re.search(r"醃", s) and re.search(r"高麗菜|小黃瓜|紅蘿蔔|苦瓜|白蘿蔔", s) and not MEAT.search(s.replace("蛋","")): return ("菜", None, "冷藏 2 天")
    if MEAT.search(s.replace("蛋","")) and re.search(r"水煮至熟|汆燙去血水|撕絲", s): return ("肉", None, "冷藏 2 天（已煮熟）")
    # 蛋打散、白飯打散、麵條煮熟、冬粉泡軟：當天做
    if re.search(r"打散|白飯", s) and not re.search(r"水煮.*剝殼|剝殼", s):
        if not re.search(r"切|醃|泡|去腸泥", s.replace("打散","")): return None
    if re.search(r"水煮.*剝殼|剝殼", s): return ("蛋", "水煮蛋剝殼", "冷藏 3 天")
    if re.search(r"醃(?!醬|料)", s):
        if SEAFOOD.search(s): return ("肉", None, "冷藏 1 天")
        return ("肉", None, "冷凍 2 週／冷藏 2 天")
    if SAUCE.search(s) and not re.search(r"下鍋|煮至|倒入|放入|淋|煮滾成|拌炒", s): return ("醬", None, "冷藏 1 週")
    if SEAFOOD.search(s) and re.search(r"切|去腸泥|吐沙|擦乾|抓", s): return ("肉", None, "冷藏 1 天")
    if MEAT.search(s.replace("蛋","")) and re.search(r"切|拌|汆燙|拍鬆|擦乾|劃", s): return ("肉", None, "冷凍 2 週／冷藏 2 天")
    if re.search(r"汆燙|燙", s) and re.search(r"冰鎮|撈起|至熟", s): return ("菜", None, "冷藏 2 天（燙好瀝乾）")
    if re.search(r"泡軟|泡水|泡水去澱粉", s) and STAPLE.search(s): return None
    if re.search(r"切|洗|剝|摘|泡軟|去籽|去蒂|去皮|撕|刨|對切|刮", s):
        if LEAFY.search(s): return ("菜", None, "冷藏 2 天（瀝乾裝袋）")
        return ("菜", None, "冷藏 3 天")
    return None

# 防呆：資料已經寫回過（time 已是平日時間），再跑會把時間再切一次；只給新食譜或 --force 用
if "--force" not in sys.argv and all("prepAhead" in r for r in recipes):
    sys.exit("recipes.js 已全部有 prepAhead，time 已是平日時間；這支只給尚未拆分的食譜用（要重算加 --force）")
recipes = [r for r in recipes if "--force" in sys.argv or "prepAhead" not in r]
if "--force" in sys.argv:
    # 還原成拆分前的總動手時間再重算
    for r in recipes:
        if "prepAhead" in r:
            batch = any(p["type"] == "整道" for p in r["prepAhead"])
            r["time"] = r["weekendMinutes"] if batch else r["time"] + r["weekendMinutes"]
out = {}
for r in recipes:
    steps = r["steps"]
    if r.get("prep") == "weekend":
        out[r["id"]] = {"prepAhead": [{"type": "整道", "what": "整道做好，放涼分裝", "keep": "冷藏 3 天／冷凍 7 天", "steps": list(range(1, len(steps)+1))}],
                        "weekendMinutes": r["time"], "time": 3, "weekday": "加熱就能吃"}
        continue
    items = []
    for i, s in enumerate(steps, 1):
        # 從第一步往下切；遇到第一個「不能先做、而且是烹調」的步驟就停
        head = s.split("，")[0]
        c = classify(s, r)
        if c:
            items.append({"type": c[0], "what": c[1] or s, "keep": c[2], "steps": [i]})
        elif COOK.search(head) and not re.search(r"預熱", head):
            break
    # 同型合併
    merged = []
    for it in items:
        m = next((x for x in merged if x["type"] == it["type"]), None)
        if m:
            m["what"] += "；" + it["what"]; m["steps"] += it["steps"]
            if "1 天" in it["keep"] or ("2 天" in it["keep"] and "3 天" in m["keep"]): m["keep"] = it["keep"]
        else: merged.append(it)
    n_prep = sum(len(x["steps"]) for x in merged)
    wk = min(r["time"] - 2, n_prep * 2) if n_prep else 0
    wk = max(wk, 0)
    out[r["id"]] = {"prepAhead": merged, "weekendMinutes": wk, "time": max(2, r["time"] - wk)}

OVR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prep-overrides.json")
if os.path.exists(OVR):
    for k, v in json.load(open(OVR)).items():
        assert k in out, k
        out[k].update(v)
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=0)
for r in recipes:
    o = out[r["id"]]
    tag = "整道" if r.get("prep") == "weekend" else "／".join(f'{x["type"]}{x["steps"]}' for x in o["prepAhead"]) or "無"
    print(f'{r["id"]} | {r["name"]} | 原{r["time"]}→週末{o["weekendMinutes"]}+平日{o["time"]} | {tag} | ' + " / ".join(r["steps"])[:110])
