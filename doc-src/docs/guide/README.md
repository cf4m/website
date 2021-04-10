---
sidebar: auto
---

# Guide

## Install

### [CF4M Maven](https://maven.enaium.cn)

[![Maven URL](https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Fmaven.enaium.cn%2Fcn%2Fenaium%2Fcf4m%2Fcf4m%2Fmaven-metadata.xml&style=flat-square)](https://maven.enaium.cn)

### [JitPack](https://jitpack.io/#cf4m/cf4m)

[![JitPack](https://img.shields.io/jitpack/v/github/cf4m/cf4m?style=flat-square)](https://jitpack.io/#cf4m/cf4m)

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
    public static class UpdateEvent extends Listener {
    }

    public static class Render2DEvent extends Listener {
    }
}
```

::: warning
Must be in the same package as the main class 
:::

### Module

::: warning
You must use `CF4M.INSTANCE.getModule().onKey(key);` to use keyboard
:::


Create the `Sprint` class.

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, category = "MOVEMENT")
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
        moduleExtend = CF4M.INSTANCE.getModule().getByInstance(this).getExtend();
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
@Module(value = "Sprint", key = Keyboard.KEY_V, category = Category.MOVEMENT)
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
You need to use `CF4M.INSTANCE.getCommand().execCommand(message)` in the `sendChatMessage` method of the game
:::

prefix: `

```java
@Command({"e", "enable"})
public class EnableCommand {
    @Exec
    private void exec(@Param("module") String name) {
        ModuleProvider module = CF4M.INSTANCE.getModule().getByName(name);

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
        for (ModuleProvider module : CF4M.INSTANCE.getModule().getAll()) {
            JsonArray jsonArray = new JsonArray();
            try {
                jsonArray = new Gson().fromJson(read(CF4M.INSTANCE.getConfig().getByInstance(this).getPath()), JsonArray.class);
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
        for (ModuleProvider module : CF4M.INSTANCE.getModule().getAll()) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("name", module.getName());
            jsonObject.addProperty("enable", module.getEnable());
            jsonObject.addProperty("key", module.getKey());
            jsonArray.add(jsonObject);
        }
        try {
            write(CF4M.INSTANCE.getConfig().getByInstance(this).getPath(), new Gson().toJson(jsonArray));
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

## Configuration

You can configure the method that overrides the `IConfiguration` interface for configuration 

```java
@Configuration
public class ExampleConfig implements IConfiguration {
}
```

### message

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public ICommandConfiguration getCommand() {
        return new ICommandConfiguration() {
            @Override
            public void message(String message) {
                Minecraft.getMinecraft().ingameGUI.getChatGUI().printChatMessage(new ChatComponentText(message));
            }
        };
    }
}
```

### prefix

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public ICommandConfiguration getCommand() {
        return new ICommandConfiguration() {
            @Override
            public String prefix() {
                return "-";
            }
        };
    }
}
```

### enable and disable

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public IModuleConfiguration getModule() {
        return new IModuleConfiguration() {
            @Override
            public void enable(Object module) {

            }

            @Override
            public void disable(Object module) {

            }
        };
    }
}
```

### config

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public IConfigConfiguration getConfig() {
        return new IConfigConfiguration() {
            @Override
            public boolean enable() {
                return false;
            }
        };
    }
}
```

::: tip
`@Configuration` annotation CF4M will automatically add for you
:::