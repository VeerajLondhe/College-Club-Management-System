
using Microsoft.EntityFrameworkCore;
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

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            // Seed data
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<CcmsContext>();
                SeedData(context);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }

        private static void SeedData(CcmsContext context)
        {
            try
            {
                // Ensure database is created
                context.Database.EnsureCreated();

                // Seed roles if they don't exist
                if (!context.Roles.Any())
                {
                    context.Roles.AddRange(
                        new Role { RName = "admin" },
                        new Role { RName = "student" }
                    );
                    context.SaveChanges();
                }

                // Get roles for reference
                var adminRole = context.Roles.First(r => r.RName == "admin");
                var studentRole = context.Roles.First(r => r.RName == "student");

                // Seed users if they don't exist
                if (!context.Users.Any())
                {
                    context.Users.AddRange(
                        new User
                        {
                            Uname = "Admin User",
                            Email = "admin@college.edu",
                            Password = "admin123", // In production, this should be hashed
                            Phoneno = "1234567890",
                            DName = "Computer Science",
                            RId = adminRole.RId
                        },
                        new User
                        {
                            Uname = "John Doe",
                            Email = "john@college.edu",
                            Password = "student123",
                            Phoneno = "0987654321",
                            DName = "Computer Science",
                            RId = studentRole.RId
                        },
                        new User
                        {
                            Uname = "Jane Smith",
                            Email = "jane@college.edu",
                            Password = "student123",
                            Phoneno = "1122334455",
                            DName = "Electronics",
                            RId = studentRole.RId
                        },
                        new User
                        {
                            Uname = "Club Head User",
                            Email = "clubhead@college.edu",
                            Password = "clubhead123",
                            Phoneno = "5566778899",
                            DName = "Mechanical Engineering",
                            RId = studentRole.RId
                        }
                    );
                    context.SaveChanges();
                }

                // Create a test club for the club head
                var clubHeadUser = context.Users.FirstOrDefault(u => u.Email == "clubhead@college.edu");
                if (clubHeadUser != null && !context.Clubs.Any(c => c.UId == clubHeadUser.UId))
                {
                    var testClub = new Club
                    {
                        Clubname = "Tech Innovation Club",
                        Description = "A club focused on technological innovation and entrepreneurship",
                        Creationdate = DateOnly.FromDateTime(DateTime.Now.AddDays(-30)),
                        Status = true, // Approved
                        UId = clubHeadUser.UId
                    };
                    context.Clubs.Add(testClub);
                    context.SaveChanges();

                    // Make the user a club head
                    var clubMember = new ClubMember
                    {
                        UId = clubHeadUser.UId,
                        CId = testClub.CId,
                        Position = "club_head",
                        ReqStatus = true
                    };
                    context.ClubMembers.Add(clubMember);
                    context.SaveChanges();
                }

                Console.WriteLine("Data seeding completed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error seeding data: {ex.Message}");
            }
        }
    }
}
