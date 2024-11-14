import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { GridData } from '../../../_core/domains/data/grid.data';
import { MRQuestionEntity } from '../../../_core/domains/entities/meeyredt/mr.question.entity';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class QuestionComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Imports: [],
    Exports: [],
    Actions: [],
    Filters: [],
    Features: [
      ActionData.reload(() => { this.loadItems(); }),
    ],
    HideSearch: true,
    Reference: MRQuestionEntity,
  };
  constructor() {
    super()
    this.properties = [
      { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true },
      { Property: 'Name', Title: 'Câu hỏi', Type: DataType.String, Align: 'center', DisableOrder: true },
      { Property: 'Email', Title: 'Email', Type: DataType.String, Align: 'center', DisableOrder: true },
      { Property: 'Message', Title: 'Tin nhắn', Type: DataType.String, Align: 'center', DisableOrder: true },
    ];
  }

  async ngOnInit(): Promise<void> {
    this.render(this.obj);

  }
}
