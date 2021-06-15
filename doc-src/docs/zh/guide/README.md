---
sidebar: auto
---

# 指南

## 安装

### [CF4M Maven](https://maven.enaium.cn)

[![Maven URL](https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Fmaven.enaium.cn%2Fcn%2Fenaium%2Fcf4m%2Fcf4m%2Fmaven-metadata.xml&style=flat-square)](https://maven.enaium.cn)

### [JitPack](https://jitpack.io/#cf4m/cf4m)

[![JitPack](https://img.shields.io/jitpack/v/github/cf4m/cf4m?style=flat-square)](https://jitpack.io/#cf4m/cf4m)

### [Releases](https://github.com/cf4m/cf4m/releases)

[![Releases](https://img.shields.io/github/v/release/cf4m/cf4m?style=flat-square)](https://github.com/cf4m/cf4m/releases)

## 使用

### Instance

创建主类.

```java
public enum Example {

    INSTANCE;

    public void run() {
        CF4M.run(this);
        // CF4M.run(this, Minecraft.getMinecraft().mcDataDir.toString() + "/" + name);
    }
}
```

### Start

在游戏运行时使用`Run`.

`Example.INSTANCE.run();`


### Event

```java
public class Events {
    public static class UpdateEvent {
    }

    public static class Render2DEvent {
    }
}
```

::: warning
必须和主类在同级包下
:::

### Module

::: warning
您必须使用`CF4M.MODULE.onKey(key);` 才可以使用快捷键
:::


创建`Sprint`类.

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, type = "MOVEMENT")
//@Module("Sprint")
public class Sprint {
    @Event
    private void onUpdate(UpdateEvent updateEvent) {
        Minecraft.getMinecraft().thePlayer.setSprinting(true);
    }
}
```

::: tip
`@Module`注解CF4M会自动为您添加
:::

#### Enable和Disable

```java
@Enable
public void onEnable() {
    System.out.println("onEnable");
}

@Disable
public void onDisable() {
    System.out.println("onDisable");
}
```

#### 扩展

为Module扩展变量

```java
@Extend
public class ModuleExtend {
    public String tag;
    public int age;
    public Action fun;

    public interface Action {
        void on();
    }
}
```

::: tip
`@Extend`注解CF4M会自动为您添加
:::

```java
    private ModuleExtend moduleExtend;

    @Enable
    public void enable() {
        moduleExtend = CF4M.MODULE.getByInstance(this).getExtend();
        moduleExtend.tag = "tag1";
        moduleExtend.age = 1;
        moduleExtend.fun = () -> System.out.println("FUN1");
    }

    @Disable
    public void disable() {
        System.out.println(moduleExtend);
        System.out.println(moduleExtend.tag);
        System.out.println(moduleExtend.age);
        moduleExtend.fun.on();
    }
```

### Setting

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, type = Category.MOVEMENT)
public class Sprint {

    @Setting(value = "test1", description = "description")
    private EnableSetting test1 = new EnableSetting(false);

    @Setting("test2")
    private IntegerSetting test2 = new IntegerSetting(1, 1, 1);

    @Event
    private void onUpdate(UpdateEvent updateEvent) {
        Minecraft.getMinecraft().thePlayer.setSprinting(true);
    }
}
```

#### 自定义Setting

```java
public class EnableSetting {

    private boolean enable;

    public EnableSetting(boolean enable) {
        this.enable = enable;
    }

    public boolean getEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }
}
```

```java
public class IntegerSetting {

    private Integer current;
    private Integer min;
    private Integer max;

    public IntegerSetting(Integer current, Integer min, Integer max) {
        this.current = current;
        this.min = min;
        this.max = max;
    }

    public Integer getCurrent() {
        return current;
    }

    public void setCurrent(Integer current) {
        this.current = current;
    }

    public Integer getMin() {
        return min;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }
}
```

::: tip
`@Setting`注解CF4M会自动为您添加
:::

### Command

::: warning
您需要在游戏的`sendChatMessage`方法下使用`CF4M.COMMAND.execCommand(message)`
:::

prefix: `

```java
@Command({"e", "enable"})
public class EnableCommand {
    @Exec
    private void exec(@Param("module") String name) {
        ModuleProvider module = CF4M.MODULE.getByName(name);

        if (module == null) {
            CF4M.configuration.command().message("The module with the name " + name + " does not exist.");
            return;
        }

        module.enable();
    }
}
```

::: tip
`@Command({"index"})`注解CF4M会自动为您添加
:::

### Config

```java
@Config("Module")
public class ModuleConfig {
    @Load
    public void load() {
        for (ModuleProvider module : CF4M.MODULE.getAll()) {
            JsonArray jsonArray = new JsonArray();
            try {
                jsonArray = new Gson().fromJson(read(CF4M.CONFIG.getByInstance(this).getPath()), JsonArray.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
            for (JsonElement jsonElement : jsonArray) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                if (module.getName().equals(new Gson().fromJson(jsonObject, JsonObject.class).get("name").getAsString())) {
                    if (jsonObject.get("enable").getAsBoolean()) {
                        module.enable();
                    }
                    module.setKey(jsonObject.get("key").getAsInt());
                }
            }
        }
    }

    @Save
    public void save() {
        JsonArray jsonArray = new JsonArray();
        for (ModuleProvider module : CF4M.MODULE.getAll()) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("name", module.getName());
            jsonObject.addProperty("enable", module.getEnable());
            jsonObject.addProperty("key", module.getKey());
            jsonArray.add(jsonObject);
        }
        try {
            write(CF4M.CONFIG.getByInstance(this).getPath(), new Gson().toJson(jsonArray));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String read(String path) throws IOException {
        return FileUtils.readFileToString(new File(path));
    }

    private void write(String path, String string) throws IOException {
        FileUtils.writeStringToFile(new File(path), string, "UTF-8");
    }
}
```

::: tip
`@Config`注解CF4M会自动为您添加
:::

### Autowired

支持的字段`所有Container`

```java
@Autowired
private ModuleContainer moduleContainer;
```

```java
@Autowired
public class Test {
    private ModuleContainer moduleContainer;
}
```

### 成分

实例化可以被`Autowried`注入

```java
@Component
public class UtilTest {
    public void util() {
        System.out.println("Util test");
    }
}
```

### Bean

```java
@Bean
public UtilBean utilBean() {
    return new UtilBean();
}
```

## 配置

更新前缀

```java
public class Message extends CommandConfiguration {
    @Override
    public String getPrefix() {
        return "-";
    }
}
```

您还可以使用配置文件`cf4m.configuration.properties`进行配置

```properties
cf4m.command.prefix=-
cf4m.command.message=cn.enaium.cf4m.example.utils.ChatUtil:message
cf4m.config.enable=false
```

### 自定义配置

```java
@Configuration("test")
public class ConfigurationTest {
    //@Value("value")
    @Value
    private String value;

    public String getValue() {
        return value;
    }
}
```

```properties
test.value=ConfigurationTest
```

::: tip
`@Configuration`注解CF4M会自动为您添加
:::

## 插件

CF4M还提供了插件的支持

```java
public class PluginExample implements PluginInitialize {
    @Override
    public void initialize(Plugin plugin) {

    }
}
```

配置文件 `cf4m.plugin.properties`

```properties
plugin=org.cf4m.plugin.PluginExample
name=CF4M-Plugin-Example
description=a plugin for cf4m
version=1.0
author=Enaium
```

## 注解

|注解|描述|
|-|-|
|`@Module`|加上这个注解,这个类是`module`|
|`@Setting`|加上这个注解,这个字段是`module`的`setting`|
|`@Extend`|加上这个注解,这个类是`module`的扩展|
|`@Enable`|加上这个注解,这个方法在`module`启用时被调用|
|`@Disable`|加上这个注解,这个方法在`module`禁用时被调用|
|`@Command`|加上这个注解,这个类是`command`|
|`@Exec`|加上这个注解,这个方法是可以执行的`command`|
|`@Param`|加上这个注解,这个方法的参数是`command`的参数名称|
|`@Config`|加上这个注解,这个类是`config`|
|`@Load`|加上这个注解,这个方法会在`config`加载时调用|
|`@Save`|加上这个注解,这个方法会在`config`保存时调用|
|`@Autowired`|加上这个注解,这个类\方法会自己赋值|
|`@Configuration`|加上这个注解,这个类是 `configuration`|