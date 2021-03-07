const { print, select } = require('./utils')

const execa = require('execa')

const stdio = { stdio: 'inherit' }

const color = {
  main: '#b8f1ed', // 杏仁饼海洋蓝
  release: '#fd803a', // 马卡龙玫瑰果
  build: '#f1b8f1', // 马卡龙粉
  changelog: '#ffe647', // 马卡龙可可凤梨
  commit: '#cf8878', // 杏仁饼，果仁糖，巧克力
  npm: '#f1707d', // 马卡龙草莓奶霜
  success: '#ff4500', // 橙红色
  fail: '#FF0000' // 纯红
}

const publish = async () => {
  print('[Publish] ---------- publish start ---------- ', color.main)

  // 发版
  const versionType = await select(
    ['patch', 'minor', 'major'],
    'Release type ?'
  )

  print(
    `[Publish: release] ---------- release ${versionType} start ----------`,
    color.release
  )

  await execa('yarn', ['standard-version', '--release-as', versionType], stdio)

  print(`[Publish: release] ---------- release end ----------`, color.release)

  // 生成最新一版产物
  print(`[Publish: build] ---------- build start ----------`, color.build)

  await execa('yarn', ['build'], stdio)

  print(`[Publish: build] ---------- build end ----------`, color.build)

  // 生成变更日志
  print(
    `[Publish: changelog] ---------- changelog generation start ----------`,
    color.changelog
  )

  try {
    await execa('yarn', ['changelog-all'], stdio)

    print(
      `[Publish: changelog] ---------- changelog generated ----------`,
      color.changelog
    )
  } catch {
    print(
      `[Publish: changelog] ---------- changelog generation failed. Have you git commit ? ----------`,
      color.fail
    )
  }

  // 提交 build 产物与 changelog
  print(
    `[Publish: auto commit] ---------- automatic commit start ----------`,
    color.commit
  )

  await execa('git', ['add', '-A'], stdio)

  const pkg = require('../package.json')
  await execa('git', ['commit', '-m', `release: version ${pkg.version}`], stdio)

  print(
    `[Publish: auto commit] ---------- automatic commit end ----------`,
    color.commit
  )

  // 决定是否发布到 npm
  const toNPM = await select(['no', 'yes'], 'Publish to NPM ?', color.main)

  if (toNPM === 'yes') {
    print(`[Publish: npm] ---------- publish npm start ----------`, color.npm)
    await execa('yarn', ['push'], stdio)
    print(`[Publish: npm] ---------- publish npm end ----------`, color.npm)
  }

  print(`[Publish] ---------- publish end ----------`, color.main)

  print('[Publish] ready push to remote git repo', color.success)

  return
}

publish()
