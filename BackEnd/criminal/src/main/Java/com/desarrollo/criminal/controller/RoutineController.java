import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.service.RoutineService;

import lombok.AllArgsConstructor;

import org.hibernate.annotations.SoftDelete;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@AllArgsConstructor
@RestController
@RequestMapping("/api/routines")
public class RoutineController {
    private final RoutineService routineService;

    @GetMapping
    public ResponseEntity<List<Routine>> getAllRoutines() {
        return ResponseEntity.ok(routineService.getAllRoutines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Routine> getRoutineById(@PathVariable Long id) {
        Optional<Routine> routine = routineService.getRoutineById(id);
        return routine.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Routine> createRoutine(@RequestBody Routine routine) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routineService.createRoutine(routine));
    }
}