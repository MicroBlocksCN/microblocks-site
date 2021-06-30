#### Linux Setup ####

Go to the [Download](download) page and click the **Download** button.

The browser will give you the option to save the file or open it with **Software Install**. Select open.

Click the **Install** button. Enter the root password when prompted and click **Authenticate**.

The first time you install MicroBlocks you must reboot.
The installer adds the user to the access group for the serial port,
but that change does not take effect until the next reboot.

#### Troubleshooting ####

If **Software Install** does not work, click the **Download** button and save the file instead of opening it.

Open a terminal and run (for 64-bit):

    sudo dpkg -i ~/Downloads/ublocks-amd64.deb

or (for 32-bit):

    sudo dpkg -i ~/Downloads/ublocks-i386.deb

If MicroBlocks **does not connect** to your board,
make sure that you rebooted after running the installer. Then run:

    groups

to verify that you are in the **dialout** and **tty** groups.

To verify that Linux sees your board, make sure the board is plugged in, then run:

    ls /dev | grep ACM

You should see an entry for your board, usually ttyACM0.
