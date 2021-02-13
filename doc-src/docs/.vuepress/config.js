module.exports = {
    title: 'CF4M',
    description: 'CF4M Doc',
    dest: '../docs',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'CF4M',
            description: 'Client Framework for Minecraft'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'CF4M',
            description: 'Minecraft客户端框架'
        }
    },
    themeConfig: {
        sidebar: 'auto',
        repo: 'cf4m/cf4m',
        docsDir: 'docs',
        editLinks: true,
		smoothScroll: true,
        locales: {
            '/': {
                label: 'English',
                selectText: 'Languages',
                ariaLabel: 'Select language',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                nav: require('./nav/en')
            },
            '/zh/': {
                label: '简体中文',
                selectText: '选择语言',
                ariaLabel: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                nav: require('./nav/zh'),
            }
        }
    }
}