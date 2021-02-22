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
        CF4M.INSTANCE.run(this, Minecraft.getMinecraft().mcDataDir.toString() + "/" + name);
    }
}
```

### Start

在游戏运行和停止时使用`Run`.

`Example.INSTANCE.run();`


### Event

::: tip
CF4M内置了2个Event(KeyboardEvent,UpdateEvent)
:::

::: warning 
您必须`new KeyboardEvent(key).call();` `new UpdateEvent().call();` 才能使用
:::

### Module

::: warning
必须和主类在同级包下
:::

创建`Sprint`类.

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
@Expand
public class Module {
    @Value("tag")
    String Haha;
}
```

::: tip
`@Extend`注解CF4M会自动为您添加
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

    private EnableSetting test1 = new EnableSetting(this, "test1", "test1", false);

    private IntegerSetting test2 = new IntegerSetting(this, "test1", "test1", 1, 1, 1);

    private FloatSetting test3 = new FloatSetting(this, "test1", "test1", 1.0F, 1.0F, 1.0F);

    private DoubleSetting test4 = new DoubleSetting(this, "test1", "test1", 1.0D, 1.0D, 1.0D);

    private LongSetting test5 = new LongSetting(this, "test1", "test1", 1L, 1L, 1L);

    private ModeSetting test6 = new ModeSetting(this, "test1", "test1", "Mode1", Arrays.asList("Mode1", "Mode2"));

    @Event
    private void onUpdate(UpdateEvent updateEvent) {
        Minecraft.getMinecraft().thePlayer.setSprinting(true);
    }
}
```

::: tip
您不需要任何操作就能使`Setting`添加
:::

### Command

::: warning
您需要在游戏的`sendChatMessage`方法下使用`CF4M.INSTANCE.command.isCommand(message)`
:::

prefix: `

```java
@Command({"h", "help"})
public class HelpCommand implements ICommand {
    @Override
    public boolean run(String[] args) {
        CF4M.INSTANCE.configuration.message("Here are the list of commands:");
        for (Map.Entry<String[], ICommand> entry : CF4M.INSTANCE.command.getCommands().entrySet()) {
            CF4M.INSTANCE.configuration.message(Arrays.toString(entry.getKey()));
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
            Object module = CF4M.INSTANCE.module.getModule(args[1]);

            if (module == null) {
                CF4M.INSTANCE.configuration.message("The module with the name " + args[1] + " does not exist.");
                return true;
            }

            CF4M.INSTANCE.module.enable(module);
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
`@Command({"index"})`注解CF4M会自动为您添加
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
`@Config`注解CF4M会自动为您添加
:::

## 配置

您可以配置重写`IConfiguration`接口的方法来进行配置

```java
@Configuration
public class ExampleConfig implements IConfiguration {
}
```

### 消息

```java
@Configuration
public class ExampleConfig implements IConfiguration {
    @Override
    public void message(String message) {
        Minecraft.getMinecraft().ingameGUI.getChatGUI().printChatMessage(new ChatComponentText(message));
    }
}
```

### 前缀

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
`@Configuration`注解CF4M会自动为您添加
:::