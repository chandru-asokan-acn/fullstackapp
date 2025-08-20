import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class SimpleServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/api/hello", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                String response = "Hello from Java Backend!";
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });
        
        server.createContext("/api/countries", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                String response = "[\"USA\", \"Canada\", \"UK\", \"Germany\", \"France\", \"Japan\", \"Australia\"]";
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });
        
        server.createContext("/api/states", new HttpHandler() {
            public void handle(HttpExchange exchange) throws IOException {
                String response = "[\"California\", \"Texas\", \"Florida\", \"New York\", \"Illinois\", \"Pennsylvania\"]";
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });
        
        server.start();
        System.out.println("Server started on port 8080");
    }
}