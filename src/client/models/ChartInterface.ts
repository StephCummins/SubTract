export default interface Chart {
  labels: string[];
  datasets: Datasets[];
}

interface Datasets {
  data: number[];
  backgroundColor: string[];
}
