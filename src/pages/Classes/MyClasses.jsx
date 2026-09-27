import { useAuth } from '../../context/AuthContextTemp';
import { useMyClasses } from '../../hooks/useClasses';

export default function MyClasses() {
  const { user } = useAuth();
  const { data: classes, isLoading } = useMyClasses(user?.id);

  return (
    <div className="page">
      <h1>My Classes</h1>
      {isLoading ? <p>Loading...</p> : (
        <ul className="my-classes-list">
          {classes?.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.day_of_week}, {c.start_time} to {c.end_time} (Capacity: {c.capacity})
            </li>
          ))}
          {classes?.length === 0 && <p>No classes assigned yet.</p>}
        </ul>
      )}
    </div>
  );
}