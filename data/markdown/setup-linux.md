#### Linux 设置 ####

进入[下载](https://www.microblocksfun.cn/download)页面，点击「**下载**」按钮。

浏览器会让你选择保存文件或用**软件安装**打开文件。选择「打开」。

单击「**安装**」按钮。在提示时输入根密码，然后点击「**验证**」。

第一次安装 MicroBlocks 时，你必须重新启动。安装程序将用户添加到串行端口的访问组中，但这一变更在下次重启前不会生效。

#### 疑难解答 ####

如果**软件安装**不成功，请点击「**下载**」按钮，保存文件（请勿直接运行）。

打开一个终端并运行（64 位）：

    sudo dpkg -i ~/Downloads/ublocks-amd64.deb

或（32 位）：

    sudo dpkg -i ~/Downloads/ublocks-i386.deb

如果 MicroBlocks **没有连接到**你的主板上，确保你在运行安装程序后重新启动。然后运行:

    groups

来验证你是否在 **dialout** 和 **tty** 组中。

要验证 Linux 是否检测到你的主板，确保主板已经连接，然后运行：

    ls /dev | grep ACM

你应该会看到主板有一个条目，通常是 ttyACM0。
