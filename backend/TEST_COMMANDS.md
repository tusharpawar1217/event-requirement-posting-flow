# Backend Test Commands

## Start the server
```bash
npm run dev
```

## Test health endpoint
```bash
curl http://localhost:5000/api/v1/health
```

## Valid Planner Request
```bash
curl -X POST http://localhost:5000/api/v1/requirements \
  -H "Content-Type: application/json" \
  -d "{\"eventName\":\"Corporate Annual Meeting\",\"eventType\":\"Corporate\",\"dateMode\":\"single\",\"eventDate\":\"2027-05-15T10:00:00.000Z\",\"location\":\"New York\",\"venue\":\"Convention Center\",\"category\":\"planner\",\"details\":{\"servicesNeeded\":[\"Catering\",\"AV Equipment\"],\"guestCount\":200,\"budgetMin\":10000,\"budgetMax\":20000,\"currency\":\"USD\",\"theme\":\"Professional\",\"needsVendorCoordination\":true}}"
```

## Valid Performer Request
```bash
curl -X POST http://localhost:5000/api/v1/requirements \
  -H "Content-Type: application/json" \
  -d "{\"eventName\":\"Wedding Reception\",\"eventType\":\"Wedding\",\"dateMode\":\"single\",\"eventDate\":\"2027-06-20T18:00:00.000Z\",\"location\":\"Los Angeles\",\"venue\":\"Grand Hotel\",\"category\":\"performer\",\"details\":{\"performerType\":\"Band\",\"genres\":[\"Jazz\",\"Pop\"],\"durationMinutes\":180,\"numberOfPerformers\":5,\"feePerPerformer\":500,\"equipmentProvidedByHost\":true,\"stageSize\":\"20x15 feet\"}}"
```

## Valid Crew Request
```bash
curl -X POST http://localhost:5000/api/v1/requirements \
  -H "Content-Type: application/json" \
  -d "{\"eventName\":\"Music Festival\",\"eventType\":\"Festival\",\"dateMode\":\"range\",\"startDate\":\"2027-07-10T08:00:00.000Z\",\"endDate\":\"2027-07-12T23:00:00.000Z\",\"location\":\"Austin\",\"venue\":\"Zilker Park\",\"category\":\"crew\",\"details\":{\"crewRoles\":[\"Stage Hands\",\"Security\"],\"crewCount\":20,\"shiftStart\":\"08:00\",\"shiftEnd\":\"20:00\",\"experienceLevel\":\"Intermediate\",\"payRate\":25,\"payType\":\"hourly\",\"accommodationProvided\":true,\"transportProvided\":false,\"toolsRequired\":[\"Radios\",\"Safety Gear\"]}}"
```

## Invalid Request (budgetMax < budgetMin)
```bash
curl -X POST http://localhost:5000/api/v1/requirements \
  -H "Content-Type: application/json" \
  -d "{\"eventName\":\"Invalid Event\",\"eventType\":\"Corporate\",\"dateMode\":\"single\",\"eventDate\":\"2027-05-15T10:00:00.000Z\",\"location\":\"Boston\",\"category\":\"planner\",\"details\":{\"servicesNeeded\":[\"Catering\"],\"guestCount\":100,\"budgetMin\":20000,\"budgetMax\":10000,\"currency\":\"USD\"}}"
```

## List all requirements
```bash
curl http://localhost:5000/api/v1/requirements
```

## List by category
```bash
curl http://localhost:5000/api/v1/requirements?category=planner
```
