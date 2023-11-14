# MEVN

MEVN stand for MongoDB, Express, Vue, Nodejs. It's an all-in-one solution for building monolith web app with Vue3, Express, MongoDB, Nodejs.

### Backend (be)
- Automatically generate API documents (as images below), you don't need to create/maintain it manually
- db mongoose with predefined collections (User, DAU, DbMigration, HealthCheck, API Metric, FileStorage, SystemConfig, Tasks, Notification, Announcement).
- mongoose replication configuration (coming soon).
- Built-in database migration workflow.
- Built-in authentication using json web token.
- User API: predefined api to create user, modifier user profile, forgot password, recover password via email, delete account request & cancel.
- Hmm API: query mongoose directly from frontend side.
- System config API: shared storage for both fe + be.
- Notification api
- Built-in API metric: meter api call, average ms spent on each API call.
- Built-in cronjob workflow.
- Built-in long task workflow.
- App hooks.
- Realtime: SocketIO + Redis
- Tracing: jaeger (coming soon).
- Email sender
- Docker script to built & publish container.
- GitHub action auto build on release

### File Server (https://github.com/ThinhVu/file-server)
- mongodb gridfs, s3
- detect media file
- generate image thumbnail

### Frontend (fe)
- vue3 + vite + UnoCSS
- vitest (coming soon)
- predefined CSS rules (of course you can use another plugins)
- predefined Vue components: input, load data, data table, dialog service, message box, notification, image slide, image viewer, pulse block, tooltip, progress bar, spacer, icon, date time format, imgx, paging,...
- predefined template: admin dashboard
- built-in utility class to work with provided backend API.
- Hmm client: query mongoose directly from frontend sidee.
- hook
- caching
- file uploader
- tracing: jeager (coming soon)
- log pipe: reading backend log directly from frontend in realtime.
- view logger
- dashboard with API metric in chart or table.
- built-in authentication (jsonwebtoken).
- and a lot more...

### Example images

API document generated automatically
![api-doc.png](images%2Fapi-doc-1.png)

Postman file generated automatically
![postman.png](images%2Fpostman.png)

Dashboard with API metric in chart & health check
![admin-dashboard.png](images%2Fadmin-dashboard-1.png)

System config
![system-config.png](images%2Fsystem-config.png)

File System
![file-system.png](images%2Ffile-system-1.png)

### Research
- https://dev.to/samchon/typia-15000x-faster-validator-and-its-histories-1fmg
- https://dev.to/samchon/i-made-express-faster-than-fastify-4h8g
- https://github.com/honojs/hono/

### TODO
- API input validation (like zod)
- domain driven design (considering)
- i18n
- unit test
- e2e test
- Auth0, Clerk integration
- more UI components
- improve Dockerfile build
