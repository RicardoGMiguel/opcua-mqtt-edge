import 'dotenv/config';
import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    AttributeIds,
    ClientSubscription,
    ClientMonitoredItem,
    DataValue
} from 'node-opcua';
import { connect } from 'mqtt';

const app_api_url = process.env.APP_WEB_API || 'mqtt://localhost:1883';

const clientMqtt = connect(app_api_url);

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
}

const options = {
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
};
const client = OPCUAClient.create(options);

const subscribe = async () => {

    const endpointUrl = `opc.tcp://${process.env.OPCUA_SERVER_HOSTNAME}:${process.env.OPCUA_SERVER_PORT}${process.env.OPCUA_SERVER_RESOURCE_PATH}`;

    console.log('Trying to connecting on:', endpointUrl);

    await client.connect(endpointUrl);

    console.log('Connected on:', endpointUrl);

    const session = await client.createSession();

    const subscription = ClientSubscription.create(session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 100,
        publishingEnabled: true,
        priority: 10
    });

    subscription.on("started", function () {
        console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId);
    }).on("keepalive", function () {
        console.log("server keepalive");
    }).on("terminated", function () {
        console.log("server terminated");
    });


    const itemToMonitor = {
        nodeId: "ns=1;s=MyVariable",
        attributeId: AttributeIds.Value
    };

    const parameters = {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 10
    };

    const monitoredItem = ClientMonitoredItem.create(
        subscription,
        itemToMonitor,
        parameters,
    );


    monitoredItem.on("changed", (dataValue: DataValue) => {
        console.log(" value has changed : ", dataValue.value.value.toString());

        clientMqtt.publish('testOPC', dataValue.value.value.toString());
    });

}

subscribe();
