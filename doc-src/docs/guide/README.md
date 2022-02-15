---
sidebar: auto
---

# Guide

## Install

### [CF4M Maven](https://maven.enaium.cn)

[![Maven URL](https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Fmaven.enaium.cn%2Fcn%2Fenaium%2Fcf4m%2Fcf4m%2Fmaven-metadata.xml&style=flat-square)](https://maven.enaium.cn)

### [Releases](https://github.com/cf4m/cf4m/releases)

[![Releases](https://img.shields.io/github/v/release/cf4m/cf4m?style=flat-square)](https://github.com/cf4m/cf4m/releases)

## Usage

### Instance

Create the main class.

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

Use `Run` in game Run.

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
Must be in the same package as the main class 
:::

### Module

::: warning
You must use `CF4M.MODULE.onKey(key);` to use keyboard
:::


Create the `Sprint` class.

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
`@Module` annotation CF4M will automatically add for you
:::

#### Enable and Disable

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

#### Extend

Extend variables for module

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
`@Extend` annotation CF4M will automatically add for you
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

#### custom Setting

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
`@Setting` annotation CF4M will automatically add for you
:::

### Command

::: warning
You need to use `CF4M.COMMAND.execCommand(message)` in the `sendChatMessage` method of the game
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
`@Command({"index"})` annotation CF4M will automatically add for you
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
`@Config` annotation CF4M will automatically add for you
:::

### Autowired

Support field`AllContainer`

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

### Component

Instance can be inject by `Autowried`

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

## Configuration

Edit prefix

```java
public class Message extends CommandConfiguration {
    @Override
    public String getPrefix() {
        return "-";
    }
}
```

You can also use configuration files `cf4m.configuration.properties` configure 

```properties
cf4m.command.prefix=-
cf4m.command.message=cn.enaium.cf4m.example.utils.ChatUtil:message
cf4m.config.enable=false
```

### Custom Configuration

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
`@Configuration` annotation CF4M will automatically add for you
:::

## Plugin

CF4M also provides plugin support

```java
public class PluginExample implements PluginInitialize {
    @Override
    public void initialize(Plugin plugin) {
        
    }
}
```

Configuration file `cf4m.plugin.properties`

```properties
plugin=org.cf4m.plugin.PluginExample
name=CF4M-Plugin-Example
description=a plugin for cf4m
version=1.0
author=Enaium
```

## Annotation

|Annotation|Description|
|-|-|
|`@Module`|Add this annotation to the class to that this class is a `module`|
|`@Setting`|Add this annotation to the field to that this field is `module` setting|
|`@Extend`|Add this annotation to the class to that this class is a module extend|
|`@Enable`|Add this annotation to the method to that this class will be invoke at `module` enable|
|`@Disable`|Add this annotation to the method to that this class will be invoke at `module` disable|
|`@Command`|Add this annotation to the class to that this class is a `command`|
|`@Exec`|Add this annotation to the method to that this method is a executable `command`|
|`@Param`|Add this annotation to the method param to that this `command` param name|
|`@Config`|Add this annotation to the class to that this class is a `config`|
|`@Load`|Add this annotation to the method to that this method will be invoke at `config` load|
|`@Save`|Add this annotation to the method to that this method will be invoke at `config` save|
|`@Autowired`|Add this annotation to the class/field to the field of this class will be auto put|
|`@Configuration`|Add this annotation to the class to that this class is a `configuration`|