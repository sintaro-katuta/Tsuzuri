# Pull Request Rules

このプロジェクトにおけるプルリクエスト作成のルールを定義します。

## 基本原則
- **言語**: 全て **日本語** で記述すること。

## ブランチ命名規則
`type/description` の形式を使用してください。

- **Type**:
  - `feat`: 新機能の追加
  - `fix`: バグ修正
  - `refactor`: リファクタリング（機能追加やバグ修正を含まない変更）
  - `docs`: ドキュメントのみの変更
  - `chore`: ビルドプロセスやツールの変更、ライブラリ更新など
  - `design`: UIデザインの変更
- **Description**: 変更内容を簡潔に表す英語またはローマ字（例: `add-login`, `fix-header-bug`）

例: `feat/add-user-auth`, `fix/datepicker-layout`

## PRタイトル
`[Type] 変更の概要` の形式を使用してください。

例: `[Feat] ユーザー認証機能の追加`, `[Fix] デートピッカーのレイアウト崩れ修正`

## PR本文の構成
PRテンプレートに従い、以下のセクションを含めてください。

1. **概要 (Summary)**: 変更の目的と何をしたかを記述。
2. **変更点 (Changes)**: 具体的な変更内容を箇条書きで記述。
3. **動作確認 (Verification)**: 行ったテストや確認手順、結果を記述。
4. **関連Issue (Related Issues)**: 解決するIssueや関連するIssueへのリンク。
