# Virtual Round Robin

This is an example of how Virtual Round Robin can be done on **Typsecript**

## Explanation

Round-Robin is a process scheduling algorithm that is simple to implement, within an operating system each process is assigned a fair and orderly portion of time, treating all processes with the same priority.

Schema:

```mermaid
graph LR
A[New]  --> B(Ready)
B --> D((Process))
D --> G[Finish]
D[New]  --> E(I/O)
E --> F(Aux)
F --> D
graph LR
A[New]  --> B(Ready)
A --> C(Round Rect)
B --> D{Rhombus}
C --> D
```
