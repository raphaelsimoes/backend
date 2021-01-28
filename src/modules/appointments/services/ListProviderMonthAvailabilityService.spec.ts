import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeappointmentRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;


describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeappointmentRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeappointmentRepository);
    });

    it('should be able to list the month availability from provider', async () => {

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 8, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 9, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 10, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 11, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 12, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 13, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 14, 0, 0),
        });
             
        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 15, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 16, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 20, 17, 0, 0),
        });

        await fakeappointmentRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 0, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2021,
            month: 1,
        });
        
        expect(availability).toEqual(expect.arrayContaining([
            { day: 19, available: true },
            { day: 20, available: false },
            { day: 21, available: true },
            { day: 22, available: true }
        ]));
    });
});