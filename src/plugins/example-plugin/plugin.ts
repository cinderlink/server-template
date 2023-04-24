/**
 * This is an example plugin that implements a simple add function.
 * It exposes two p2p events:
 * - /example/add/request: request to add two numbers
 * - /example/add/response: response to add two numbers
 *
 * It also exposes one pubsub event:
 * - /example/add/result: result of adding two numbers.
 *      this event is published by the plugin when it receives a response to a request.
 *
 * The plugin also subscribes to the /example/add/result event and logs the result.
 */

import type { PluginInterface, PluginEventDef } from "@cinderlink/core-types";
import { ReceiveEventHandlers } from "@cinderlink/core-types";
import { SubscribeEventHandlers } from "@cinderlink/core-types";
import { EncodingOptions } from "@cinderlink/core-types";
import { IncomingP2PMessage } from "@cinderlink/core-types";
import { CinderlinkClientInterface } from "@cinderlink/core-types";

/**
 * This is the definition of the events that this plugin exposes.
 * It is used to provide type safety for the plugin.
 * It also makes it easy to see what events are exposed by the plugin,
 * and whether they are properly implemented.
 */
export interface ExamplePluginEvents extends PluginEventDef {
  send: {
    "/example/add/request": {
      requestId: string;
      a: number;
      b: number;
    };
    "/example/add/response": {
      requestId: string;
      a: number;
      b: number;
      sum: number;
    };
  };
  receive: {
    "/example/add/request": {
      requestId: string;
      a: number;
      b: number;
    };
    "/example/add/response": {
      requestId: string;
      a: number;
      b: number;
      sum: number;
    };
  };
  publish: {
    "/example/add/result": {
      requestId: string;
      a: number;
      b: number;
      sum: number;
    };
  };
  subscribe: {
    "/example/add/result": {
      requestId: string;
      a: number;
      b: number;
      sum: number;
    };
  };
  emit: {
    "/example/add/result": {
      requestId: string;
      a: number;
      b: number;
      sum: number;
    };
  };
}

/**
 * This is the actual plugin class. It implements the PluginInterface.
 * It also implements the ReceiveEventHandlers and SubscribeEventHandlers interfaces
 * to let the client know which events we need to subscribe to and support.
 */
export class ExamplePlugin implements PluginInterface {
  // The id of the plugin. This is used to identify and access the plugin from other plugins.
  public readonly id = "example-plugin";

  // Each plugin has a constructor that takes a CinderlinkClientInterface.
  // This is used to send and receive messages, subscribe to and publish events, and create and access schemas in the user database.
  constructor(public client: CinderlinkClientInterface<ExamplePluginEvents>) {}

  // These are the p2p receive event handlers.
  // They are called when a message is received on the specified topic.
  // The message is typed to include the payload and the peer that sent the message.
  p2p: ReceiveEventHandlers<ExamplePluginEvents> = {
    // When we receive a request to add two numbers, we send a response with the sum.
    "/example/add/request": (
      message: IncomingP2PMessage<
        ExamplePluginEvents,
        "/example/add/request",
        EncodingOptions
      >
    ) => {
      const { requestId, a, b } = message.payload;
      this.client.send(message.peer.peerId.toString(), {
        topic: "/example/add/response",
        payload: { requestId, a, b, sum: a + b },
      });
    },

    // When we receive a response to a request to add two numbers, we publish and emit the result.
    "/example/add/response": (
      message: IncomingP2PMessage<
        ExamplePluginEvents,
        "/example/add/response",
        EncodingOptions
      >
    ) => {
      const { requestId, a, b, sum } = message.payload;
      this.client.publish("/example/add/result", { requestId, a, b, sum });
      this.client.pluginEvents.emit("/example/add/result", {
        requestId,
        a,
        b,
        sum,
      });
    },
  };

  // These are the pubsub subscribe event handlers.
  // They are called when a message is received on the specified topic.
  // The message is typed to include the payload and the peer that sent the message.
  pubsub: SubscribeEventHandlers<ExamplePluginEvents> = {
    // When we receive a result of adding two numbers, we log and emit it.
    "/example/add/result": (message) => {
      const { requestId, a, b, sum } = message.payload;
      console.log(
        `peer ${message.peer.peerId.toString()} received add response: ${a} + ${b} = ${sum}`
      );
      this.client.pluginEvents.emit("/example/add/result", {
        requestId,
        a,
        b,
        sum,
      });
    },
  };
}
