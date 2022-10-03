const sdk = require('api')('@onesignal/v9.0#vkskhql3uu3ucg');

sdk['create-notification']({
  app_id: 'string',
  included_segments: ['string'],
  external_id: 'string',
  contents: {
    en: 'English or Any Language Message',
    es: 'Spanish Message'
  },
  name: 'INTERNAL_CAMPAIGN_NAME',
  send_after: 'string',
  delayed_option: 'string',
  delivery_time_of_day: 'string',
  throttle_rate_per_minute: 0
}, {
  Authorization: 'Basic YOUR_REST_API_KEY'
})
  .then(res => console.log(res))
  .catch(err => console.error(err));