package api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import com.skyhorizon.skyhorizon_airways.SkyhorizonAirwaysApplication;

public class index extends HttpServlet {
    
    private static final long serialVersionUID = 1L;
    private static ApplicationContext context;

    @Override
    public void init() throws ServletException {
        if (context == null) {
            context = new SpringApplicationBuilder(SkyhorizonAirwaysApplication.class)
                    .web(org.springframework.boot.WebApplicationType.SERVLET)
                    .run();
        }
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // In a real Vercel Java implementation, we would bridge the HttpServletRequest 
        // to the Spring DispatcherServlet. Due to cold-start limits on Vercel's serverless
        // environment, running a full Spring context is highly experimental.
        resp.setStatus(200);
        resp.getWriter().write("SkyHorizon Airways Spring Boot application - Vercel Serverless Wrapper");
    }
}
