=================================================================
               Data Submission System - User Guide
                      (2025 Latest Version)
=================================================================

🚀 Quick Start Guide

1️⃣ First: Install the Program
   👆 Right-click install.bat → 【Run as Administrator】
   ⏳ Installation will proceed automatically (2-3 minutes)
   ❌ If Node.js error occurs: Install from https://nodejs.org/ then retry

2️⃣ Second: Run the Program
   🚀 Development: Double-click run.bat (Recommended)
   🏢 Production: Use npm start command

3️⃣ Third: Access Website
   🌐 Browser opens automatically after 5 seconds
   📍 Or manually access http://localhost:5000

4️⃣ Fourth: Admin Login
   🔐 Click "Admin" button in top-right corner
   🔑 Enter password: 0000

5️⃣ Fifth: Stop Program
   🛑 Press Ctrl+C in run window or close window

=================================================================
📁 File Description

install.bat     → 🔧 Program installation (Admin rights required)
run.bat         → 🚀 Development/Test execution (Recommended)
README_USAGE.txt → 📖 This file (Usage instructions)

=================================================================
✨ New Features

🔹 Auto browser launch: Webpage opens automatically 5 seconds after server start
🔹 Port conflict detection: Automatically detects ports already in use
🔹 Admin rights check: Automatically checks permissions during installation
🔹 Detailed progress display: Shows status for each step
🔹 Automatic error diagnosis: Provides solutions when problems occur

=================================================================
❓ Troubleshooting

🔴 Installation Failed
   → Node.js not installed: Install LTS version from https://nodejs.org/
   → Insufficient permissions: Right-click → "Run as Administrator"
   → Internet connection: Check stable network connection

🔴 Execution Failed
   → Check if install.bat was run first
   → Port conflict: Close other programs and retry

🔴 Website Won't Open
   → Check server start message (wait 5-10 seconds)
   → Check firewall settings
   → Temporarily disable antivirus real-time scanning

🔴 Admin Login Failed
   → Password: 0000 (four zeros)
   → Clear browser cookies/cache and retry

=================================================================
💡 Usage Tips

✅ Recommended Usage Order
   install.bat (once only) → run.bat (every time)

✅ Development vs Production
   • Development mode: Auto-restart on code changes (for development/testing)
   • Production mode: Optimized execution (for actual service)

✅ Frequently Used Features
   • Create event: Admin → Dashboard → "New Event"
   • Submit file: Main page → Select event → Upload file
   • Check submissions: Admin → Dashboard → Event list

✅ Network Sharing
   To access from other computers, use server computer's IP address
   Example: http://192.168.1.100:5000

=================================================================
📞 Additional Help

This program has been verified through Playwright automated testing.
All functions have been confirmed to work properly.

================================================================= 