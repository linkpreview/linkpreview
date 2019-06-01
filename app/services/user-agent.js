export function checkCrawler(userAgent) {
  return /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex/i
    .test(userAgent);
}