# Windows Developer Setup

This guide covers the Windows-specific steps required to build and test Zenvyra locally.

## Required Tools

- Git for Windows
- Node.js 20 LTS
- Java JDK 21 (Temurin/Eclipse Adoptium recommended)
- Maven 3.9+ (or use the bundled `mvnw` wrapper)
- MongoDB 7+ (local or Docker)
- Redis 7+ (local or Docker)

## 1. Install Java JDK 21

Download the MSI installer from [Adoptium](https://adoptium.net/) or [Oracle](https://www.oracle.com/java/technologies/downloads/#java21).

During installation, enable the option **"Add to PATH"** if available.

## 2. Configure `JAVA_HOME`

`JAVA_HOME` must point to the **JDK root directory**, not the `bin` folder.

### Example correct path

```powershell
C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot
```

### Example incorrect path

```powershell
C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot\bin
```

### Setting via System Properties

1. Press `Win + S`, search for **"Edit the system environment variables"**, and open it.
2. Click **Environment Variables**.
3. Under **System variables**, click **New**.
4. Variable name: `JAVA_HOME`
5. Variable value: the JDK root path (no `\bin` at the end).
6. Click OK on all dialogs.
7. Restart any open PowerShell, Command Prompt, or terminal windows.

### Setting via PowerShell (current session only)

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot"
```

### Setting via PowerShell (permanent, user scope)

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot", "User")
```

Restart your terminal after running this command.

## 3. Verify `JAVA_HOME`

Open a new PowerShell window and run:

```powershell
$env:JAVA_HOME
javac -version
java -version
```

Expected output resembles:

```text
C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot
javac 21.0.3
openjdk version "21.0.3" 2024-04-16 LTS
```

If `javac` is not found, add `%JAVA_HOME%\bin` to your `Path` environment variable.

## 4. Run Backend Tests

From the repository root:

```powershell
cd backend
.\mvnw.cmd -q -DskipTests compile
.\mvnw.cmd test
```

If `JAVA_HOME` is misconfigured, Maven will report that it cannot find the JDK or `javac`.

## 5. Frontend Notes

After a clean install on Windows, the Next.js SWC native binary is downloaded automatically. If `next build` fails with a missing native dependency, delete `frontend/node_modules` and reinstall:

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
npm ci --no-audit --no-fund
```

Confirm `frontend/node_modules/.bin/next.cmd` exists after installation.

## 6. Local Environment

Copy `.env.example` to `.env` at the repository root and fill in the required secrets before running the full stack locally.
