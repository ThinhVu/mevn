# mevn
Mevn


### Backend
- db mongoose with predefined collections (User, DAU, DbMigration, HealthCheck, API Metric, FileStorage, SystemConfig, Tasks, Notification, Announcement).
- mongoose replication configuration (incomming).
- Built-in database migration workflow.
- Built-in authentication using json web token.
- User API: predefined api to create user, modifier user profile, forgot password, recover password via email, delete account request & cancel.
- Hmm API: query mongoose directly from frontend side.
- System config API: shared storage for both fe + be.
- Notification api
- Built-in API metric: meter api call, average ms spent on each API call.
- Built-in logger: async log to file system.
- Built-in cronjob workflow.
- Built-in long task workflow.
- App hooks.
- Realtime: SocketIO + Redis, Rabbitmq.
- Tracing: jaeger (coming soon).
- Monitoring: Prometheus + SocketIO admin.
- Email delivery
- Docker script to built & publish container.


### Frontend
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

### Images

![admin-dashboard.png](images%2Fadmin-dashboard.png)


![log-viewer.png](images%2Flog-viewer.png)
