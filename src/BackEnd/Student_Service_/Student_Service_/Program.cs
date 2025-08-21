
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;
using Student_Service_.Models;

namespace Student_Service_
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("dbcs");
            builder.Services.AddDbContext<CcmsContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; // Define a name for the policy

            // --- Add services to the container ---
            builder.Services.AddDiscoveryClient(builder.Configuration);
            // 1. Add CORS Service and define a policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      // Add the origin of your React app
                                      policy.WithOrigins("http://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                                  });
            });

            // Add services to the container.

            builder.Services.AddControllers();

            //var connectionString = builder.Configuration.GetConnectionString("server=localhost;port=3306;user=root;password=Mack@7507;database=ccms");

            //// 2. ? REGISTER THE DBCONTEXT HERE
            //// This tells the application how to create CcmsContext
            //builder.Services.AddDbContext<CcmsContext>(options =>
            //    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            //);




            //Creationg here service provider
            //var provider = builder.Services.BuildServiceProvider();

            // Learn more about configuring Swagger/OpenAPI at
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            //// Seed data
            //using (var scope = app.Services.CreateScope())
            //{
            //    var context = scope.ServiceProvider.GetRequiredService<CcmsContext>();
            //    SeedData(context);
            //}

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseDiscoveryClient();
            app.UseCors(MyAllowSpecificOrigins);
            //app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
