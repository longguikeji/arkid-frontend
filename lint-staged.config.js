module.exports = {
  '*.{js,jsx,ts,tsx,vue}': [
    'vue-cli-service lint',
    'git add'
  ],
  '*.{vue,htm,html,css,sss,less,scss}': [
    'vue-cli-service lint:style',
    'git add'
  ]
}
