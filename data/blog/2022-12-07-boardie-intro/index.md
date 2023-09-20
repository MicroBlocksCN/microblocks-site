如果一个人没有编程主板，怎么入门 MicroBlocks 呢 ?

这是我们过去几年在研讨会上介绍 MicroBlocks 时，多次遇到的问题。也是教师面临的一个问题，他们没有足够的板子给班上的每个学生使用。

使用 **Boardie** ! 这是一个 MicroBlocks 的虚拟器，让人们在浏览器中可以直接尝试 MicroBlocks。

![A screenshot showing the Boardie UI](boardie.png)

Boardie 的目标是把 MicroBlocks 介绍给那些打算进行物理计算但还没有编程主板的人。我们希望帮助他们看到，给微控制器编码是很容易且有趣的，并鼓励他们深入到实际的物理计算中去。

#### Boardie 不是什么

Boardie 不打算取代真正的微控制器。物理计算的魔力来自于它与真实物理世界互动的能力: 感知光、声音和温度等物理现象，并控制灯、马达和电器等事物。

Boardie 没有试图模拟物理传感器或输出设备。虽然模拟这些东西并不困难, 例如，滑块可以作为虚拟的传感器输入，动画图像可以显示虚拟的马达和舵机, 但我们觉得这样做忽略了重点。

我们希望人们能够体验在实际的物理世界中进行物理计算的魅力，以及由此带来的学习热情。

#### Boardie 是什么

Boardie 是一块虚拟主板，可以做一些实际的微控制器能做的事情。它有两个可编程的按钮，就像 micro:bit 一样，它可以模拟 micro:bit 的 5x5 LED 显示屏或 Adafruit Clue 的 240x240 像素的 TFT 显示屏。它可以发出方波蜂鸣声和播放曲子，并支持一个简单的文件系统。最后，它支持 MicroBlocks HTTP 客户端库，这个客户端原本用于 WiFi 板子。

#### 使用 Boardie

你可以点击 [这里](https://microblocksfun.cn/run/microblocks.html)(浏览器中) 来使用 Boardie. 由于它不需要 WebSerial，因此可以在 Safari 、Firefox 、Chrome 和 Edge 中运行。 Boardie 在 MicroBlocks 独立应用程序中不受支持，只能用于浏览器版本。

通过单击 USB 图标, 并选择**连接模拟器**来启动 Boardie。 当 Boardie 打开时，MicroBlocks 会连接到它，您可以像使用真实的物理设备一样对其进行编程和交互。

MicroBlocks 一次只能连接到一个板子上。因此，由于 Boardie 是一个虚拟板，你在将 MicroBlocks 连接到物理板之前，需要先断开 Boardie。点击 USB 图标菜单中的 **断开连接** 或者点击 Boardie 右上角的的电源开关来断开连接。Boardie 在断开连接后会消失。

#### 例子

这里有一个在 Boardie 上运行的简单 micro:bit 例子，**心跳** 项目。

![The heartbeat project running on Boardie](heartbeat.gif)

点击 Boardie 上的 A 按钮，运行脚本。

当 Boardie 设备处于聚焦状态时，你也可以使用键盘上的左右方向键或 A、B 键来激活按钮。这个功能对游戏很有用。

拥有一个 TFT 显示屏意味着我们不再局限于 5x5 的矩阵。与 Adafruit Clue、Citilab ED1 或 M5Stack 一样，你可以使用 MicroBlocks TFT 库在屏幕上绘制任意的图形 (也支持海龟(turtle)库！)

这个跳跳球游戏最初是为 Citilab ED1 设计的，但其编码可自动调整到不同的屏幕尺寸。

![The jumpy ball game running on Boardie](jumpy.gif)

Boardie 具有一个大约 5MB 的文件系统，可以存储数据或文件。这个记忆游戏使用 MicroBlocks BMP 库来显示图像。

![The memory game running on Boardie](memory.gif)

你可能已经注意到，Boardie TFT 屏幕实际上是一个触摸屏，这给你的用户界面设计提供了更多的可能性，而不仅仅是两个按钮。

Boardie 还带有一个扬声器。面板底部的扬声器格栅在播放声音时发光(像是音量提示)。

![Boardie playing some music](sound.gif)

完全相同的游戏，在真实的板子上运行:

![The snake game on an Adafruit Clue](snake.gif)

我们迫不及待地想看看你将用 Boardie 创造出什么!

---

#### Boardie 技术参数

对于更注重技术的人来说，以下是这个虚拟主板的技术参数:

- RAM: 65kB
- 文件存储: 大约 5MB
- 输入: A 和 B 按钮, A+B 组合按钮, 触摸屏
- 输出: 240x240 像素 24-bit TFT, 扬声器
- 网络能力: HTTP 客户端

---

#### 致谢

非常感谢 SAP 青年思想家小组的负责人 Christiane 提议构建 Boardie。我们最初持怀疑态度，但现在我们都很喜欢 Boardie!
