#### Citilab ED1, M5 Stack, and other ESP32 and ESP8266 Boards  ####

Board setup is similar for the **Citilab ED1**,
**M5 Stack**, **M5 StickC**, **M5 StickC+**, **M5 Atom Matrix**,
and other popular boards based on the **ESP32** and **ESP8266** such
as the **NodeMCU** and **Wemos D1 Mini**.

Connect the board to your computer.

From the MicroBlocks menu (gear icon), select **update firmware on board**.

<img src="/assets/img/md/get-started/update-firmware-menu.png" width="180">

Select your board type from the menu.

<img src="/assets/img/md/get-started/select-other.png" width="180">

If you are running MicroBlocks in the browser, you will be asked to
select the board if it is not already connected.

MicroBlocks will start the firmware install process.

<img src="/assets/img/md/get-started/esp-connecting.png" width="360">

**Note:** Some ESP boards will connect only if you hold down the **Flash** or **Boot** button
at the start of the firmware installation process.
You can release the button when the progress indicator appears.

Once MicroBlocks has connected the board, you will see a progress indicator
as the firmware is installed.

<img src="/assets/img/md/get-started/esp-progress.png" width="360">

For ESP32 boards, the progress sequence will repeat several times
as different parts of the firmware are installed.
The firmware installation process can take several minutes.

When the process completes, MicroBlocks should reconnect to the board.

If MicroBlocks fails to reconnect after installation, quit and restart
MicroBlocks (when running in the browser, reload the page).

#### Troubleshooting ####

Firmware installation on ESP32 and ESP8266 boards can be tricky.

Some boards require you to hold down the **Flash** or **Boot** button
to start the installation process.

On other boards, firmware installation may fail randomly,
not only with MicroBlocks but with other tools as well.
You may need to try several times.

It sometimes helps to unplug the board, quit and restart
MicroBlocks (or, when running in the browser, reload the page),
then plug the board in and try again.

Fortunately, ESP boards work well with MicroBlocks
once the firmware is installed.
