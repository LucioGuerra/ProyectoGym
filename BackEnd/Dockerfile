# Usamos una imagen de base de Java JDK 17 (o la versión que necesites)
FROM eclipse-temurin:17-jdk-alpine

  # Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

CMD ["mvn", "clean", "package"]

  # Copiar el archivo JAR generado por Spring Boot al contenedor
COPY target/demo-0.0.1-SNAPSHOT.jar /app/demo.jar

  # Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8080

  # Comando para ejecutar el archivo JAR
ENTRYPOINT ["java", "-jar", "/app/demo.jar"]
