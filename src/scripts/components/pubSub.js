// private var topics
var topics = {};

// a singleton that returns the single instance.
class PubSub {
  bind(topic, listener) {
    // create the topic if not yet created
    if (!topics[topic]) {
      topics[topic] = [];
    }

    // add the listener
    topics[topic].push(listener);
  }

  trigger(topic, data) {
    // return if the topic doesn't exist, or there are no listeners
    if (!topics[topic] || topics[topic].length < 1) {
      return;
    }

    // send the event to all listeners
    topics[topic].forEach(function(listener) {
      listener(data || {});
    });
  }
}

const pubSub = new PubSub();

export default pubSub;
