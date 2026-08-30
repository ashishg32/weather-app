export const typeDefs = /* GraphQL */ `
  type Condition {
    code: Int!
    label: String!
    icon: String!
  }

  type Location {
    id: ID!
    name: String!
    country: String
    admin1: String
    latitude: Float!
    longitude: Float!
  }

  type CurrentConditions {
    time: String!
    temperature: Float!
    feelsLike: Float!
    humidity: Int!
    windSpeed: Float!
    isDay: Boolean!
    condition: Condition!
  }

  type HourlyPoint {
    time: String!
    temperature: Float!
    precipitationProbability: Int
    condition: Condition!
  }

  type DailyPoint {
    date: String!
    min: Float!
    max: Float!
    precipitationProbability: Int
    sunrise: String!
    sunset: String!
    condition: Condition!
  }

  type Forecast {
    timezone: String!
    current: CurrentConditions!
    hourly: [HourlyPoint!]!
    daily: [DailyPoint!]!
  }

  type Query {
    searchLocations(query: String!, limit: Int = 5): [Location!]!
    forecast(latitude: Float!, longitude: Float!, days: Int = 7): Forecast!
  }
`;