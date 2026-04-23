#!/bin/bash
# 从 OSS 拉取标准文件列表，生成签名 URL，输出 JSON
# PDF 文件直接使用原路径，DOC 文件使用 标准库-pdf/ 中转换后的 PDF

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_FILE="$PROJECT_DIR/src/data/standards.json"
TEMP_URLS="/tmp/standards-urls.txt"

echo "正在从 OSS 拉取标准文件列表..."

# 1. 获取所有 oss 路径
OSS_PATHS=$(aliyun oss ls oss://yrhsl/标准库/ 2>/dev/null | \
  grep 'oss://yrhsl' | \
  awk '{for(i=1;i<=NF;i++){if($i~/^oss:\/\//){for(j=i;j<=NF;j++){printf "%s",$j;if(j<NF)printf " "};print ""}}}')

# 2. 为每个文件生成签名 URL（有效期 1 年）
echo "正在生成签名 URL..."
> "$TEMP_URLS"
echo "$OSS_PATHS" | while IFS= read -r oss_path; do
  [ -z "$oss_path" ] && continue

  # 获取文件名和扩展名
  filename=$(basename "$oss_path")
  ext="${filename##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  if [ "$ext_lower" = "doc" ] || [ "$ext_lower" = "docx" ]; then
    # DOC/DOCX: 使用 标准库-pdf/ 中转换后的 PDF
    pdf_filename="${filename%.*}.pdf"
    pdf_oss_path="oss://yrhsl/标准库-pdf/$pdf_filename"
    signed=$(aliyun oss sign "$pdf_oss_path" --timeout 31536000 2>/dev/null | head -1)
    if [ -n "$signed" ]; then
      echo "${oss_path}|||${signed}" >> "$TEMP_URLS"
    else
      # 转换后的 PDF 不存在，用原文件
      signed=$(aliyun oss sign "$oss_path" --timeout 31536000 2>/dev/null | head -1)
      [ -n "$signed" ] && echo "${oss_path}|||${signed}" >> "$TEMP_URLS"
    fi
  else
    # PDF 等其他文件：直接使用原文件
    signed=$(aliyun oss sign "$oss_path" --timeout 31536000 2>/dev/null | head -1)
    [ -n "$signed" ] && echo "${oss_path}|||${signed}" >> "$TEMP_URLS"
  fi
done

# 3. 用 Node 解析并生成 JSON（所有文件 type 都标记为 pdf）
node "$SCRIPT_DIR/parse-standards.mjs" < "$TEMP_URLS" > "$OUTPUT_FILE"

COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUTPUT_FILE','utf8')).length)")
echo "已生成 $OUTPUT_FILE（共 $COUNT 条标准）"
rm -f "$TEMP_URLS"
