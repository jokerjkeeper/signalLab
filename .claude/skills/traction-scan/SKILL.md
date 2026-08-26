---
name: traction-scan
description: 用即時網路抓取掃描「GitHub Trending / Product Hunt 的牽引力訊號」，找出正在竄紅但未必已募資的 OSS 專案與新產品，並整理成 Signal Lab 可匯入的格式。當使用者想知道最近開發者/使用者在追什麼、想從榜單找早期項目、或說「掃一下最近紅什麼」「traction-scan」時使用。可帶參數：github(只抓 GitHub Trending) / ph(只抓 Product Hunt) / all(預設兩者)；亦可加方向詞 edu / decision / infra 做後篩。
---

# Traction Scan — GitHub Trending / Product Hunt 牽引力掃描

幫使用者用**即時抓取**兩個榜單，找出正在竄紅的 OSS 專案與新產品。這是「牽引力視角」——看的是 star 速度 / upvote，時間點比 `signal-scan`（募資視角）更早，通常還沒拿到錢。整理成可貼回 Signal Lab 的格式。

## 參數解析

從使用者輸入(args)判斷：

- **來源**：`github` / `gh` → 只抓 GitHub Trending；`ph` / `producthunt` → 只抓 Product Hunt；未指定 → `all`（兩者都抓）
- **方向後篩**（可選）：`edu` / `decision` / `infra` → 抓完後只留該領域的項目
- **數量**：預設每個來源 6~10 個（過濾後）

## 執行步驟

**一定要實際呼叫 WebFetch 抓當下榜單，不可只靠模型既有知識（會過時/幻覺）。**

### 1. 抓 GitHub Trending（source = github / all）

- `WebFetch https://github.com/trending?since=daily`，取每個 repo 的：`owner/repo`、一句話描述、主要語言、總 star、**今日 star（stars today）**。
- 需要更廣可再抓 `?since=weekly`，或用 `https://github.com/trending/python`（語言）等分頁。
- **今日 star 是主要熱度指標**，放進輸出的「募資/指標」欄，格式 `⭐ 813/day`。

### 2. 抓 Product Hunt（source = ph / all）

- `WebFetch https://www.producthunt.com/`，取每個產品的：名稱、tagline（一句話描述）、upvote 數。
- **注意**：Product Hunt 前 4 小時會隱藏 upvote（「equal visibility」），且動態渲染可能只抓到前幾名。**抓不到 upvote 就標「未知」，絕不編造數字。** 可改抓 `https://www.producthunt.com/leaderboard/daily/...` 補資料。
- 指標欄格式 `▲ 320`；抓不到就 `▲ 未知`。

### 3. 過濾（本 skill 的重點）

榜單雜訊高，**務必剔除**：

- **純套殼**：只是包一層 GPT/LLM 的 wrapper、無獨特切入點
- **教學/清單/範本**：`awesome-*`、教學 repo、`dotfiles`、course、boilerplate、demo
- **玩具/練習專案**：無真實用途、明顯個人練習

**保留**：有真實產品切入點 / 明確用途 / 潛在護城河 / 解決具體痛點者。對每個保留項目給 1~5 `signal`（依 star 速度或 upvote 高低 + 是否非套殼綜合判斷）。

### 4. 加值查證（可選，對亮眼項目）

- 用 WebSearch 交叉查：官網、背後是否有公司/募資、真實客戶。
- **查不到確切資訊就標「未知」，不編造。** 對真實性存疑的項目要明講。

## 輸出格式

先給一段**人類可讀摘要**（每個項目 2~4 行：名稱、在做什麼、熱度、為何值得注意、連結），再附 **Signal Lab 匯入用的 pipe 表格**，**沿用現有 8 欄格式**：

```
名稱 | 來源平台 | 類別 | 官網 | 募資/指標 | 描述 | 為何值得追 | 來源連結
```

欄位規則：

- **來源平台**：必須是 `GitHub Trending` 或 `Product Hunt`（前端據此自動判 lane，歸到「🔥 牽引力」）
- **類別**：對應 Signal Lab 的 `category` → `edu` / `decision` / `infra` / `data` / `health` / `tool`
- **募資/指標**：放牽引力指標，`⭐ 813/day`（GitHub）或 `▲ 320`（Product Hunt），抓不到標「未知」
- **官網**：GitHub 用 repo 首頁或專案官網；描述對應 `desc`；「為何值得追」放進 `notes`
- **來源連結**：GitHub 放 repo URL、Product Hunt 放產品頁 URL

## 注意

- 全程繁體中文回覆。
- 一定要實際呼叫 WebFetch 抓當下榜單，不可只靠既有知識。
- 這是「發現」工具；找到後由使用者決定哪些手動加進 Signal Lab（匯入時會**自動用名稱去重**）。
- 提醒使用者：**請點來源連結查證**，榜單熱度會變動、Product Hunt upvote 可能延遲顯示。
- 與 `signal-scan`（募資視角）並存、各司其職；兩者輸出都能貼進同一個「⇪ 匯入」框。
