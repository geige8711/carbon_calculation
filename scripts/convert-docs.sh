#!/bin/bash
# 从 OSS 下载 DOC/DOCX 文件，转为 PDF，上传到 OSS 标准库-pdf/ 目录
set -e

TEMP_DIR="/tmp/standards-convert"
PDF_DIR="/tmp/standards-pdf"
mkdir -p "$TEMP_DIR" "$PDF_DIR"

echo "=== 步骤1: 获取 DOC/DOCX 文件列表 ==="
DOC_FILES=$(aliyun oss ls oss://yrhsl/标准库/ 2>/dev/null | \
  grep 'oss://yrhsl' | \
  awk '{for(i=1;i<=NF;i++){if($i~/^oss:\/\//){for(j=i;j<=NF;j++){printf "%s",$j;if(j<NF)printf " "};print ""}}}' | \
  grep -iE '\.(doc|docx)$')

TOTAL=$(echo "$DOC_FILES" | wc -l | tr -d ' ')
echo "共 $TOTAL 个 DOC/DOCX 文件"

echo "=== 步骤2: 下载并转换 ==="
COUNT=0
FAILED=0
echo "$DOC_FILES" | while IFS= read -r oss_path; do
  [ -z "$oss_path" ] && continue
  COUNT=$((COUNT + 1))

  # 获取文件名
  FILENAME=$(basename "$oss_path")
  # PDF 文件名
  PDF_FILENAME="${FILENAME%.*}.pdf"

  echo "[$COUNT/$TOTAL] 处理: $FILENAME"

  # 下载
  if ! aliyun oss cp "$oss_path" "$TEMP_DIR/$FILENAME" -f 2>/dev/null | grep -q 'Succeed'; then
    echo "  下载失败，跳过"
    FAILED=$((FAILED + 1))
    continue
  fi

  # 转换为 PDF
  if ! soffice --headless --convert-to pdf --outdir "$PDF_DIR" "$TEMP_DIR/$FILENAME" >/dev/null 2>&1; then
    echo "  转换失败，跳过"
    FAILED=$((FAILED + 1))
    rm -f "$TEMP_DIR/$FILENAME"
    continue
  fi

  # 检查 PDF 是否生成
  if [ ! -f "$PDF_DIR/$PDF_FILENAME" ]; then
    echo "  PDF 未生成，跳过"
    FAILED=$((FAILED + 1))
    rm -f "$TEMP_DIR/$FILENAME"
    continue
  fi

  # 上传到 OSS
  if ! aliyun oss cp "$PDF_DIR/$PDF_FILENAME" "oss://yrhsl/标准库-pdf/$PDF_FILENAME" -f 2>/dev/null | grep -q 'Succeed'; then
    echo "  上传失败，跳过"
    FAILED=$((FAILED + 1))
  else
    echo "  完成"
  fi

  # 清理临时文件
  rm -f "$TEMP_DIR/$FILENAME" "$PDF_DIR/$PDF_FILENAME"
done

echo "=== 完成 ==="
echo "转换完成，失败: $FAILED"

# 清理
rm -rf "$TEMP_DIR" "$PDF_DIR"
