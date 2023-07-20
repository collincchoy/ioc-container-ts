import { Container } from "./container";

class Logger {
  log(message: string) {
    console.log(message);
  }
}

class Service {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  doSomething() {
    this.logger.log("Doing something...");
  }
}

const container = new Container();
container.register<Logger>(Logger, () => new Logger());
container.register<Service>(
  Service,
  () => new Service(container.resolve<Logger>(Logger))
);

const service = container.resolve<Service>(Service);
service.doSomething();
