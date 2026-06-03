# Signal Lab — AI 項目情報站

追蹤 AI 創業 / 眾籌項目的工具。原為單檔 HTML（`signal-lab_1.html`，保留作對照），現已用 **React + Vite + TypeScript** 重構為正式 web app，並加上 **localStorage 持久化**。

## 功能

- 項目卡片列表：名稱、來源、類別、信號強度、相關方向（②教育 / ⑤決策整合）、AI 評分
- 篩選：ALL / ②教育 / ⑤決策整合 / 基礎設施 / 高信號
- Header 統計（追蹤項目 / 高信號 / 平均分）與本週信號摘要
- 新增項目（表單 modal）、項目詳細 modal、**刪除項目**（詳情 modal 內，含確認）
- **貼上匯入**：把 `signal-scan` 產出的 pipe 格式整段貼上，自動解析加入（見下）
- **匯出 / 還原 JSON 備份**：`⤓ 匯出` 下載全部項目為 JSON；`⤒ 還原` 選備份檔合併回來（見下）
- **localStorage 持久化**：新增 / 匯入的項目重新整理後仍保留（鍵名 `signal-lab.projects`）

### 匯出 / 還原 JSON 備份

資料只存在瀏覽器 localStorage（不進 git、不跨裝置）。要備份或搬到另一台電腦 / 另一個 port：

- **⤓ 匯出**：下載 `signal-lab-backup-<日期>.json`，內含目前所有項目。
- **⤒ 還原**：選一個備份檔，**合併**進現有清單 —— 同名項目自動略過、id 撞號自動換新，完成後回報「還原 N 筆 / 略過 M 筆」。
- 還原會經過 `sanitizeImportedProjects`（`src/utils.ts`）防呆驗證：欄位型別錯誤以預設值填補、缺 `name` 的項目丟棄、非法類別歸 `other`，確保壞檔不會污染既有資料。

### 貼上匯入（pipe 格式）

點工具列「⇪ 匯入」，貼上以下格式（每列一個項目）：

```
名稱 | 來源平台 | 類別 | 官網 | 募資 | 描述 | 為何值得追 | 來源連結
```

解析器（`src/utils.ts` 的 `parseImportText`）具容錯：自動忽略表頭列、`---` 分隔線、無關標題；把「換行的網址」接回上一列；類別接受英文 key 或中文標籤；官網為「未知」時改用來源連結當可點連結；同名項目自動略過。匯入前會預覽「將加入 N 筆 / 已存在略過 / 無法解析」。

> 搭配 Claude Code 的 `/signal-scan` skill：先掃描近期 AI 項目 → 複製輸出的 pipe 區塊 → 貼進「匯入」。

> AI 深度分析按鈕目前**停用**。直接從瀏覽器呼叫 Anthropic API 會因 CORS 與金鑰外洩無法運作，待後續加上後端代理後再啟用。

## 安裝與啟動

需求：Node.js 18+

```bash
npm install      # 安裝相依套件
npm run dev      # 開發伺服器（http://localhost:5173）
npm run build    # 型別檢查 + production build → dist/
npm run preview  # 預覽 build 結果
```

## 專案結構

```
src/
├─ main.tsx              # React 入口
├─ App.tsx               # 狀態中樞 + 組裝
├─ index.css             # 全域樣式
├─ types.ts              # Project / Category / FilterKey 型別
├─ constants.ts          # DEMO_PROJECTS、類別色/標籤對應、STORAGE_KEY
├─ utils.ts              # filterProjects / deriveStats / buildInsight
├─ hooks/useLocalStorage.ts
└─ components/           # Header / InsightBar / Controls / ProjectList
                         # ProjectCard / Modal / DetailModal / AddModal / LinkIcon
```

## 資料重置

清除追蹤清單：開瀏覽器 DevTools → Application → Local Storage → 刪除 `signal-lab.projects`，重新整理即回到 demo 資料。
