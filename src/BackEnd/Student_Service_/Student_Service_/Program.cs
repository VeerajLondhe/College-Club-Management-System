
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

            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; 

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                                  });
            });


            builder.Services.AddControllers();




            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<CcmsContext>();
                SeedData(context);
            }

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
                context.Database.EnsureCreated();

                if (!context.Roles.Any())
                {
                    context.Roles.AddRange(
                        new Role { RName = "admin" },
                        new Role { RName = "student" }
                    );
                    context.SaveChanges();
                }

                var adminRole = context.Roles.First(r => r.RName == "admin");
                var studentRole = context.Roles.First(r => r.RName == "student");

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
