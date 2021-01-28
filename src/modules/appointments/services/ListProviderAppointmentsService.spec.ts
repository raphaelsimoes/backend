import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeappointmentRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;


describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeappointmentRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointments = new ListProviderAppointmentService(
            fakeappointmentRepository,
            fakeCacheProvider
        );
    });

    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeappointmentRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        const appointment2 = await fakeappointmentRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(appointments).toEqual([
            appointment1,
            appointment2
        ]);
    });

});