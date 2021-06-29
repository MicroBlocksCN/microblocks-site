#### Linux Setup ####

Go to the [Download](/download) page and click the **Download** button.

The browser will give you the option to save the file or open it with **Software Install**. Select open.

Click the **Install** button. Enter the root password when prompted and click **Authenticate**.

The first time you install MicroBlocks you must reboot to enable access to the serial port. The installer adds the user to the access group for the serial port, but that change does not take effect until the next reboot.

#### Troubleshooting ####

If **Software Install** does not work, click the **Download** button and save the file instead of opening it.

Open a terminal and run (for 64-bit):

    sudo dpkg -i ~/Downloads/ublocks-amd64.deb

or (for 32-bit):

    sudo dpkg -i ~/Downloads/ublocks-i386.deb

If MicroBlocks does not connect to the board make sure that you rebooted after running the installer. Use the:

    groups

command to verify that you are in the dialout and tty groups.

To check that Linux is connecting to your board, plug in the board and run:

    ls /dev | grep ACM

You should see an entry for your board, usually ttyACM0.
