---
home: true
heroImage: /hero.png
heroText: CF4M
tagline: Minecraft客户端框架
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简单
  details: 不用写Event、Module和Setting等等.
- title: 小
  details: 小于40KB.
- title: 轻量级
  details: 仅用了Guava库(Minecraft自带.
footer: Apache License 2.0 | Copyright © 2020 Enaium
---

添加到build.gradle文件末尾
```groovy
allprojects {
	repositories {
		maven { url 'https://cf4m.github.io/maven' }
	}
}
```
添加依赖项
```groovy
dependencies {
	implementation 'cn.enaium.cf4m:cf4m:最新版本'
}
```

最新版本=[![Maven URL](https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Fcf4m.github.io%2Fmaven%2Fcn%2Fenaium%2Fcf4m%2Fcf4m%2Fmaven-metadata.xml&style=flat-square)](https://cf4m.github.io/maven)