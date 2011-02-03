#! /usr/bin/env python
# -*- coding: utf-8 -*-
#
# Here we provide the necessary imports.
# The basic GUI widgets are located in QtGui module. 
import sys
from PyQt4.QtGui import *
 
a = QApplication(sys.argv)

w = QWidget()

w.resize(320, 240)  # The resize() method resizes the widget.
w.setWindowTitle("Hello, World!")  # Here we set the title for our window.
w.show()  # The show() method displays the widget on the screen.

sys.exit(a.exec_())  # Finally, we enter the mainloop of the application.
