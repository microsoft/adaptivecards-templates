FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["adaptivecards-templates-core.csproj", ""]
RUN dotnet restore "./adaptivecards-templates-core.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "adaptivecards-templates-core.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "adaptivecards-templates-core.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "adaptivecards-templates-core.dll"]