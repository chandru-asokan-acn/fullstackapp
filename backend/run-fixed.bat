@echo off
echo Starting Task Management System...
echo.
echo Copying updated resources...
copy src\main\resources\*.* target\classes\
echo.
echo Creating proper Spring Boot JAR...
rmdir /s /q target\classes\BOOT-INF 2>nul
mkdir target\classes\BOOT-INF\classes\com\example
mkdir target\classes\BOOT-INF\lib
mkdir target\classes\META-INF

echo Copying application files...
copy src\main\java\com\example\*.java target\classes\BOOT-INF\classes\com\example\

echo Creating Spring Boot manifest...
echo Manifest-Version: 1.0 > target\classes\META-INF\MANIFEST.MF
echo Spring-Boot-Version: 3.2.0 >> target\classes\META-INF\MANIFEST.MF
echo Main-Class: org.springframework.boot.loader.JarLauncher >> target\classes\META-INF\MANIFEST.MF
echo Start-Class: com.example.TaskManagementApplication >> target\classes\META-INF\MANIFEST.MF
echo Spring-Boot-Classes: BOOT-INF/classes/ >> target\classes\META-INF\MANIFEST.MF
echo Spring-Boot-Lib: BOOT-INF/lib/ >> target\classes\META-INF\MANIFEST.MF

echo Building JAR...
jar -cf target\task-management-backend.jar -C target\classes .
copy target\task-management-backend.jar application.jar

echo.
echo ✅ Task Management System JAR updated with fixes!
echo 📁 File: application.jar
dir application.jar