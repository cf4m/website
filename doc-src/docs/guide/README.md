---
sidebar: auto
---

# Guide

## Install

### [CF4M Maven](https://cf4m.github.io/maven)

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

    instance;

    public CF4M cf4M = new CF4M(this, Minecraft.getMinecraft().mcDataDir.toString() + "/Example");

}
```

### Start and Stop

Use `Start` and `Stop` in game Start and Stop.

`Example.instance.cf4M.start();` `Example.instance.cf4M.start();`


### Event

::: tip
2 events are built into CF4M (KeyboardEvent,UpdateEvent)
:::

::: warning 
You must `new KeyboardEvent(keyCode).call();` `new UpdateEvent().call();` can be used
:::

### Module

::: warning
Must be under the sibling package as the main class
:::

Create the `Sprint` class.

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, category = Category.MOVEMENT)
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

#### Expand

Expand variables for module

```java
@Expand
public class Module {
    @Value("tag")
    String Haha;
}
```

::: tip
`@Expand` annotation CF4M will automatically add for you
:::

##### Usage

```java
@Event
private void onUpdate(UpdateEvent updateEvent) {
    CF4M.getInstance().module.setValue(this, "tag", "Auto");
}
```

```java
@Event
private void onUpdate(UpdateEvent updateEvent) {
    CF4M.getInstance().module.getValue(module, "tag");
}
```

### Setting

```java
@Module(value = "Sprint", key = Keyboard.KEY_V, category = Category.MOVEMENT)
public class Sprint {

    @Setting
    private EnableSetting test1 = new EnableSetting(this, "test1", "test1", false);

    @Setting
    private IntegerSetting test2 = new IntegerSetting(this, "test1", "test1", 1, 1, 1);

    @Setting
    private FloatSetting test3 = new FloatSetting(this, "test1", "test1", 1.0F, 1.0F, 1.0F);

    @Setting
    private DoubleSetting test4 = new DoubleSetting(this, "test1", "test1", 1.0D, 1.0D, 1.0D);

    @Setting
    private LongSetting test5 = new LongSetting(this, "test1", "test1", 1L, 1L, 1L);

    @Setting
    private ModeSetting test6 = new ModeSetting(this, "test1", "test1", "Mode1", Arrays.asList("Mode1", "Mode2"));

    @Event
    private void onUpdate(UpdateEvent updateEvent) {
        Minecraft.getMinecraft().thePlayer.setSprinting(true);
    }
}
```

::: tip
`@Setting` annotation CF4M will automatically add for you
:::

### Command

::: warning
You need to use `Example.instance.cf4M.commandManager.isCommand(message)` in the `sendChatMessage` method of the game
:::

prefix: `

```java
@Command({"h", "help"})
public class HelpCommand implements ICommand {
    @Override
    public boolean run(String[] args) {
        CF4M.getInstance().configuration.message("Here are the list of commands:");
        for (Map.Entry<String[], ICommand> entry : Example.instance.cf4M.command.getCommands().entrySet()) {
            CF4M.getInstance().configuration.message(Arrays.toString(entry.getKey()));
        }
        return true;
    }

    @Override
    public String usage() {
        return "help";
    }
}
```

```java
@Command({"e", "enable"})
public class EnableCommand implements ICommand {
    public boolean run(String[] args) {
        if (args.length == 2) {
            Object module = CF4M.getInstance().module.getModule(args[1]);

            if (module == null) {
                CF4M.getInstance().configuration.message("The module with the name " + args[1] + " does not exist.");
                return true;
            }

            CF4M.getInstance().module.enable(module);
            return true;
        }
        return false;
    }

    @Override
    public String usage() {
        return "<module>";
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
        for (Object module : CF4M.getInstance().module.getModules()) {
            JsonArray jsonArray = new JsonArray();
            try {
                jsonArray = new Gson().fromJson(read(CF4M.getInstance().config.getPath(this)), JsonArray.class);
            } catch (IOException e) {
                System.out.println(e.getLocalizedMessage());
            }
            for (JsonElement jsonElement : jsonArray) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                if (CF4M.getInstance().module.getName(module).equals(new Gson().fromJson(jsonObject, JsonObject.class).get("name").getAsString())) {
                    if (jsonObject.get("enable").getAsBoolean()) {
                        CF4M.getInstance().module.enable(module);
                    }
                    CF4M.getInstance().module.setKey(module, jsonObject.get("key").getAsInt());
                }
            }
        }
    }

    @Save
    public void save() {
        JsonArray jsonArray = new JsonArray();
        for (Object module : CF4M.getInstance().module.getModules()) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("name", CF4M.getInstance().module.getName(module));
            jsonObject.addProperty("enable", CF4M.getInstance().module.isEnable(module));
            jsonObject.addProperty("key", CF4M.getInstance().module.getKey(module));
            jsonArray.add(jsonObject);
        }
        try {
            write(CF4M.getInstance().config.getPath(this), new Gson().toJson(jsonArray));
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
    public void message(String message) {
        Minecraft.getMinecraft().ingameGUI.getChatGUI().printChatMessage(new ChatComponentText(
                ChatFormatting.WHITE + "[" + ChatFormatting.RED + Example.instance.name + ChatFormatting.WHITE + "] " + message));
    }
}
```

### prefix

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public String prefix() {
        return "-";
    }
}
```

::: tip
`@Configuration` annotation CF4M will automatically add for you
:::