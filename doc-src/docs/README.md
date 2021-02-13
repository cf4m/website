---
home: true
heroImage: /hero.png
heroText: CF4M
tagline: Client Framework for Minecraft
actionText: Quick Start →
actionLink: /guide/
features:
- title: Easy
  details: No need to write Event,Module and Setting etc.
- title: Small
  details: Less than 40KB.
- title: Lightweight
  details: Only used Guava libraries (Minecraft comes with.
footer: Apache License 2.0 | Copyright © 2020 Enaium
---

Add it in your root build.gradle at the end of repositories
```groovy
allprojects {
	repositories {
		maven { url 'https://cf4m.github.io/maven' }
	}
}
```
Add the dependency
```groovy
dependencies {
	implementation 'cn.enaium.cf4m:cf4m:LATEST'
}
```

LATEST=[![Maven URL](https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Fcf4m.github.io%2Fmaven%2Fcn%2Fenaium%2Fcf4m%2Fcf4m%2Fmaven-metadata.xml&style=flat-square)](https://cf4m.github.io/maven)