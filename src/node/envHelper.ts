import fs from "fs";

/**
 * 替换env文里的多个变量值
 * @param envPath env文件路径，绝对路径
 * @param map 变量map形式的键值对
 */
function replaceEnvVar(envPath: string, map: Map<any, any>): void {
  let envContents = fs.readFileSync(envPath, "utf8");

  let lines = envContents.split(/\r?\n/); // 处理不同换行符

  for (const [key, newValue] of map) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 匹配键，允许前后空格和注释
    const regex = new RegExp(`^(\\s*${escapedKey}\\s*=\\s*).*?(\\s*(#.*))?$`);

    let found = false;
    const updatedLines = lines.map((line) => {
      if (line.trim().startsWith("#")) return line; // 忽略注释行
      const match = line.match(regex);
      if (match) {
        found = true;
        // 保留键和注释，替换值
        const newLine = `${match[1]}${newValue}${
          match[2] ? " " + match[2] : ""
        }`;
        return newLine;
      }
      return line;
    });

    // 如果变量不存在，添加到文件末尾
    if (!found) updatedLines.push(`${key}=${newValue}`);

    lines = updatedLines;
  }

  // 保留原有换行符风格
  const lineEnding = envContents.includes("\r\n") ? "\r\n" : "\n";

  fs.writeFileSync(envPath, lines.join(lineEnding), "utf8");
}

/**
 * 获取env文件里某个变量值
 * @param envPath env文件路径，绝对路径
 * @param key 变量key
 * @returns 变量值
 */
function getEnvVar(envPath: string, key: string): string {
  let envContents = fs.readFileSync(envPath, "utf8");

  let lines = envContents.split(/\r?\n/); // 处理不同换行符

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 匹配键，允许前后空格和注释
  const regex = new RegExp(`^(\\s*${escapedKey}\\s*=\\s*).*?(\\s*(#.*))?$`);

  let result = "";
  lines.map((line) => {
    if (line.trim().startsWith("#")) return line; // 忽略注释行
    const match = line.match(regex);
    if (match) {
      result = match[0].replace(match[1], "");
    }
  });

  return result;
}

export default { getEnvVar, replaceEnvVar };
