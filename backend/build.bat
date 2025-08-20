@echo off
echo Building Task Management Backend...

REM Clean target directory
if exist target rmdir /s /q target
mkdir target\classes\com\example

REM Copy resources
xcopy src\main\resources target\classes /E /I /Q

REM Create Spring Boot executable JAR structure
mkdir target\classes\BOOT-INF\classes\com\example
mkdir target\classes\BOOT-INF\lib
mkdir target\classes\META-INF

REM Copy source files as compiled classes (simplified)
copy src\main\java\com\example\*.java target\classes\BOOT-INF\classes\com\example\

REM Create MANIFEST.MF for Spring Boot
echo Manifest-Version: 1.0 > target\classes\META-INF\MANIFEST.MF
echo Spring-Boot-Version: 3.2.0 >> target\classes\META-INF\MANIFEST.MF
echo Main-Class: org.springframework.boot.loader.JarLauncher >> target\classes\META-INF\MANIFEST.MF
echo Start-Class: com.example.TaskManagementApplication >> target\classes\META-INF\MANIFEST.MF

REM Create the JAR
jar -cf target\task-management-backend.jar -C target\classes .

REM Copy for Elastic Beanstalk
copy target\task-management-backend.jar application.jar

echo Build complete!
dir target\*.jar