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
        CF4M.INSTANCE.run(this);
        // CF4M.INSTANCE.run(this, Minecraft.getMinecraft().mcDataDir.toString() + "/" + name);
    }
}
```

### Start

Use `Run` in game Run.

`Example.INSTANCE.run();`


### Event

::: tip
2 events are built into CF4M (KeyboardEvent,UpdateEvent).
:::

::: warning 
You must `new KeyboardEvent(key).call();` `new UpdateEvent().call();` can be used.

You don't need to use `UpdateEvent`, but you must use `KeyboardEvent`. 
:::

### Module

::: warning
Must be under the sibling package as the main class
:::

Create the `Sprint` class.

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, category = Category.MOVEMENT)
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
public class Module {
    @Value("tag")
    String Haha;
}
```

::: tip
`@Extend` annotation CF4M will automatically add for you
:::

```java
@Event
private void onUpdate(UpdateEvent updateEvent) {
    CF4M.INSTANCE.module.setValue(this, "tag", "Auto");
}
```

```java
@Event
private void onUpdate(UpdateEvent updateEvent) {
    CF4M.INSTANCE.module.getValue(module, "tag");
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
You need to use `CF4M.INSTANCE.command.isCommand(message)` in the `sendChatMessage` method of the game
:::

prefix: `

```java
@Command({"e", "enable"})
public class EnableCommand {
    @Exec
    private void exec(@Param("module") String name) {
        Object module = CF4M.INSTANCE.module.getModule(name);

        if (module == null) {
            CF4M.INSTANCE.configuration.message("The module with the name " + name + " does not exist.");
        }

        CF4M.INSTANCE.module.enable(module);
    }
}
```

::: tip
`@Command({"index"})` annotation CF4M will automatically add for you
:::

### Config

```java
@Config("Modules")
public class ModuleConfig {
    @Load
    public void load() {
        for (Object module : CF4M.INSTANCE.module.getModules()) {
            JsonArray jsonArray = new JsonArray();
            try {
                jsonArray = new Gson().fromJson(read(CF4M.INSTANCE.config.getPath(this)), JsonArray.class);
            } catch (IOException e) {
                System.out.println(e.getLocalizedMessage());
            }
            for (JsonElement jsonElement : jsonArray) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                if (CF4M.INSTANCE.module.getName(module).equals(new Gson().fromJson(jsonObject, JsonObject.class).get("name").getAsString())) {
                    if (jsonObject.get("enable").getAsBoolean()) {
                        CF4M.INSTANCE.module.enable(module);
                    }
                    CF4M.INSTANCE.module.setKey(module, jsonObject.get("key").getAsInt());
                }
            }
        }
    }

    @Save
    public void save() {
        JsonArray jsonArray = new JsonArray();
        for (Object module : CF4M.INSTANCE.module.getModules()) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("name", CF4M.INSTANCE.module.getName(module));
            jsonObject.addProperty("enable", CF4M.INSTANCE.module.isEnable(module));
            jsonObject.addProperty("key", CF4M.INSTANCE.module.getKey(module));
            jsonArray.add(jsonObject);
        }
        try {
            write(CF4M.INSTANCE.config.getPath(this), new Gson().toJson(jsonArray));
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
    public ICommandConfiguration command() {
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
    public ICommandConfiguration command() {
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
    public IModuleConfiguration module() {
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
    public IConfigConfiguration config() {
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