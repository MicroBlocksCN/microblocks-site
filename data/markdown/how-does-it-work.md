The MicroBlocks system has three components:

* A blocks editor, which runs on a host computer during code development
* Virtual machine, which runs on the microcontroller and executes the user's code
* A communication system that updates the code on the board the user edits scripts.

The blocks editor allows the user to create and edit blocks-based code. It also manages MicroBlocks libraries that provide additional functionality. Some libraries support sensors or output devices such as servos and NeoPixels, while others provide APIs for working with strings or music. Libraries are written in MicroBlocks and can be explored, modified, and extended by users.

Like MicroPython, MicroBlocks code is compiled into bytecodes that are executed by a virtual machine running on the microcontroller. Bytecodes are low-level instructions similar to machine code, but independent of any particular processor architecture. This design makes it easy for MicroBlocks to support many different 32-bit microcontrollers. In fact, the MicroBlocks virtual machine is not restricted to microcontrollers; it also runs on Linux computers such as the Raspberry Pi. It's even possible to run both the blocks editor and the virtual machine on the same computer.

If you'd like to learn more about bytecodes, see xxx. You can also enable "advanced blocks" and use the right-click menu to on a script to view the assembly language and bytecodes it generates.

The communication system send the bytecodes for scripts to the virtual machine and updates those bytecodes as the user edits their scripts. Since scripts are recompiled and sent to the virtual machine incrementally, the code is ready to go whenever the user wants to test it.

The communication system also commands to start and stop scripts and processes messages from the board that indicate when scripts start and stop, allowing the editor to provide graphical feedback about which scripts are running.

A key part of learning about sensors is seeing how they respond in real time. For example, how does the light sensor value change when you cover the micro:bit with your hand or how does acceleration change as you toss and catch the micro:bit? The communication system allows sensor values and computation result to be displayed in a little "talk bubble". It also support graphing sensor data in real time. Graphing is a powerful tool for building intuition about physical and electrical processes.
